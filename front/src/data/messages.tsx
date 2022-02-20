import { createContext, useContext, useEffect, useState } from "react"
import { fetcher, useSubmit } from "./use-fetch"
import { useWebSocket } from "./use-websocket"
import { State, createRepository } from "./repository"

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

const repository = createRepository<Message>()
const Context = createContext<{ state: State<Message>, loading: boolean }>(undefined)

export function MessagesProvider({ channelId, children }) {
    const { subscribe } = useWebSocket()
    const [state, setState] = useState(repository.initialState())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setState(repository.initialState())

        fetcher(`/channels/${channelId}/messages`).then((response) => {
            setState(repository.setAll(response))
            setLoading(false)
        })
    }, [channelId])

    useEffect(() => {
        if (loading) return;

        const { unsubscribe } = subscribe((event, data) => {
            if (event === "messages.created") {
                if (data.channelId === channelId) {
                    setState((state) => repository.addOne(state, data))
                }
            }

            if (event === "messages.removed") {
                if (data.channelId === channelId) {
                    setState((state) => repository.removeOne(state, data))
                }
            }
        })

        return unsubscribe
    }, [channelId, loading])

    const value = {
        loading,
        state
    }

    return (
        <Context.Provider value={value}>
            { children }
        </Context.Provider>
    )
}

export function useMessages(): Message[] {
    const { state } = useContext(Context)

    return repository.selectAll(state)
}

export function useMessagesLoading(): boolean {
    return useContext(Context).loading
}
