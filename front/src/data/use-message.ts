import useFetch, { fetcher, useSubmit } from "./use-fetch"

export type Message = {
    id: number
    content: string
    authorId: number
    channelId: number
}

export function useMessages(channelId: number): Message[] {
    return useFetch(`/channels/${channelId}/messages`)
}

export type CreateMessageRequest = {
    channelId: number
    content: string
}

export function useCreateMessage() {
    return useSubmit<CreateMessageRequest, Message>(({ channelId, content }) => fetcher(`/channels/${channelId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content })
    }))

}
