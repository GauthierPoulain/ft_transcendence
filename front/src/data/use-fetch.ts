import { useEffect, useMemo, useState } from "react"
import { HttpError } from "../errors/HttpError"

let accessToken: string = ""

export function setAccessToken(token: string) {
    accessToken = token
}

const apiurl = (url: string) => {
    if (process.env["NODE_ENV"] === "production")
        return `http://${document.location.hostname}/api${url}`
    else return `http://${document.location.hostname}:3005/api${url}`
}

export const fetcher = async (
    url: string,
    options = {},
    jsonResponse = true
) => {
    const response = await fetch(apiurl(url), {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
    })

    if (!response.ok) {
        console.log(
            "response not ok",
            url,
            accessToken,
            response.ok,
            response.status
        )
        throw new HttpError(response.status)
    }

    return jsonResponse ? response.json() : response
}

export function useSubmit<Request, Response>(
    callback: (req: Request) => Promise<Response>
) {
    const [state, setState] = useState(0)
    const [active, setActive] = useState(true)

    async function submit(value: Request) {
        if (active) {
            setState(1)
        }

        try {
            const data = await callback(value)
            if (active) {
                setState(2)
            }
            return data
        } catch (error) {
            if (active) {
                setState(3)
            }
            throw error
        }
    }

    useEffect(
        () => () => {
            setActive(false)
        },
        []
    )

    const value = useMemo(
        () => ({
            isLoading: state === 1,
            isSuccess: state === 2,
            isError: state === 3,

            submit,
        }),
        [state]
    )

    return value
}
