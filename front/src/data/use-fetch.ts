import { useMemo, useState } from "react"
import useSWR from "swr"

let accessToken: string | null = null

export function setAccessToken(token: string) {
    accessToken = token
}

const apiurl = (url: string) => `http://localhost:3005/api${url}`

export const fetcher = async (url: string, options = {}, jsonResponse=true) => {
    const response = await fetch(apiurl(url), {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : { })
        }
    })

    if (!response.ok) {
        throw new Error("Not an OK response code")
    }

    return jsonResponse ? response.json() : response
}

export default function useFetch(key: string, options = {}) {
    const { data, error } = useSWR(key, fetcher, { suspense: true, ...options })

    if (error) {
        console.debug("useFetch", data, error)
    }

    return data
}

export function useSubmit<Request, Response>(callback: (req: Request) => Promise<Response>) {
    const [state, setState] = useState(0)

    async function submit(value: Request) {
        setState(1)

        try {
            const data = await callback(value)
            setState(2)
            return data
        } catch (error) {
            setState(3)
            throw error
        }
    }

    const value = useMemo(() => ({
        isLoading: state === 1,
        isSuccess: state === 2,
        isError: state === 3,

        submit
    }), [state])

    return value
}
