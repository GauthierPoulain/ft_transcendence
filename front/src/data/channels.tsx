import { createContext, useContext, useEffect, useState } from "react"
import { fetcher, useSubmit } from "./use-fetch"
import { Membership } from "./use-member"
import { createRepository, State } from "./repository"
import { useWebSocket } from "./use-websocket"
import { createService } from "./service"

export type Channel = {
    id: number
    name: string
    type: "public" | "private" | "protected"
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

export type JoinChannelRequest = {
    channelId: number,
    password: string
}

export function useJoinChannel() {
    return useSubmit<JoinChannelRequest, Membership>((request) => fetcher(`/members`, {
        method: 'POST',
        body: JSON.stringify(request)
    }))
}

const repository = createRepository<Channel>()

const service = createService<Channel, void>({
    name: "channels",
    repository,

    fetcher() {
        return fetcher("/channels")
    },

    onCreated(data, setState) {
        setState((state) => repository.addOne(state, data))
    },

    onRemoved(data, setState) {
        setState((state) => repository.removeOne(state, data))
    }
})

export const ChannelsProvider = service.Provider

export function useChannels(): Channel[] {
    const { state } = useContext(service.Context)

    return repository.selectAll(state)
}

export function useChannelsLoading(): boolean {
    return useContext(service.Context).loading
}

export function useChannel(id: number): Channel | undefined {
    const { state } = useContext(service.Context)

    return repository.selectById(state, id)
}
