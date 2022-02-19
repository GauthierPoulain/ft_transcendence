import { useEffect, useState } from "react"
import useFetch, { fetcher, useSubmit } from "./use-fetch"
import { useWebSocket } from "./use-websocket"

export type Message = {
    id: number
    content: string
    authorId: number
    channelId: number
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

export type RemoveMessageRequest = {
    channelId: number
    messageId: number
}

export function useRemoveMessage() {
    return useSubmit<RemoveMessageRequest, void>(({ channelId, messageId }) => fetcher(`/channels/${channelId}/messages/${messageId}`, {
        method: 'DELETE'
    }, false))
}

export function useMessages(channelId: number) {
    const { subscribe } = useWebSocket()
    const [messages, setMessages] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        console.log("subscribe", channelId)

        fetcher(`/channels/${channelId}/messages`).then((response) => {
            setMessages(response)
            setLoading(false)
        })

        const { unsubscribe } = subscribe((event, data) => {
            if (isLoading) return;

            if (event === "channel.message.new") {
                if (data.channelId === channelId) {
                    setMessages((messages) => [...messages, data])
                }
            }

            if (event === "channel.message.remove") {
                if (data.channelId === channelId) {
                    setMessages((messages) => messages.filter(({id}) => id !== data.id))
                }
            }
        })

        return unsubscribe
    }, [channelId])

    return { isLoading, messages }
}
