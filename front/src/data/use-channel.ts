import useFetch from "./use-fetch"

export type Channel = {
    id: number
    name: string
}

export default function useChannel(id: number): Channel {
    return useFetch(`/channels/${id}`)
}

export function useJoinedChannels(): number[] {
    return useFetch(`/channels/joined`)
}

export function usePublicChannels(): number[] {
    return useFetch(`/channels`).map(({ id }) => id)
}
