import { createContext, useContext, useEffect, useState } from "react"
import { fetcher, useSubmit } from "./use-fetch"
import { useWebSocket } from "./use-websocket"
import { State, createRepository } from "./repository"
import { createService } from "./service"

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

type ProviderSettings = {
    channelId: number
}

const repository = createRepository<Message>()

const service = createService<Message, ProviderSettings>({
    name: "messages",
    repository,

    fetcher({ channelId }) {
        return fetcher(`/channels/${channelId}/messages`)
    },

    onCreated(data, setState, { channelId }) {
        if (data.channelId === channelId) {
            setState((state) => repository.addOne(state, data))
        }
    },

    onRemoved(data, setState, { channelId }) {
        if (data.channelId === channelId) {
            setState((state) => repository.removeOne(state, data))
        }
    }
})

export const MessagesProvider = service.Provider

export function useMessages(): Message[] {
    const { state } = useContext(service.Context)

    return repository.selectAll(state)
}

export function useMessagesLoading(): boolean {
    return useContext(service.Context).loading
}
