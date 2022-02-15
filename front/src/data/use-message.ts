import useFetch from "./use-fetch"

export type Message = {
    id: number
    content: string
    authorId: number
    channelId: number
}

export function useMessages(channelId: number): Message[] {
    return useFetch(`/channels/${channelId}/messages`)
}
