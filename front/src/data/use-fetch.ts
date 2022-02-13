import useSWR from "swr"

let accessToken: string | null = null

export function setAccessToken(token: string) {
    accessToken = token
}

const apiurl = (url: string) => `http://localhost:3005/api${url}`

export const fetcher = async (url: string, options = {}) => {
    const response = await fetch(apiurl(url), {
        ...options,
        headers: {
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : { })
        }
    })

    const json = await response.json()

    return json
}

export default function useFetch(key: string) {
    const { data, error } = useSWR(key, fetcher, { suspense: true })

    if (error) {
        console.debug("useFetch", data, error)
    }

    return data
}
