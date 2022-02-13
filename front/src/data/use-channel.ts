import useFetch, { fetcher } from "./use-fetch"

export type Channel = {
    id: number
    name: string
    type: "public" | "private" | "protected"
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

export type CreateChannelRequest = {
    name: string,
    joinable: boolean,
    password: string
}

export function createChannel(request: CreateChannelRequest): Promise<Channel> {
    return fetcher("/channels", {
        method: "POST",
        body: JSON.stringify(request)
    })
}
