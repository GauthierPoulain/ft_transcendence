import { useContext } from "react"
import { fetcher, useSubmit } from "./use-fetch"
import { Membership } from "./use-member"
import { createRepository } from "./repository"
import { createService } from "./service"

export type Channel = {
    id: number
    name: string
    type: "public" | "private" | "protected" | "direct"
}

export type CreateChannelRequest = {
    name: string
    joinable: boolean
    password: string
}

export function createChannel(request: CreateChannelRequest): Promise<Channel> {
    return fetcher("/channels", {
        method: "POST",
        body: JSON.stringify(request),
    })
}

export function useMutateDirectChannel() {
    return useSubmit<number, Channel>((userId) =>
        fetcher(`/channels/users/${userId}`, {
            method: "POST",
        })
    )
}

export type JoinChannelRequest = {
    channelId: number
    password: string
}

export function useJoinChannel() {
    return useSubmit<JoinChannelRequest, Membership>((request) =>
        fetcher(`/members`, {
            method: "POST",
            body: JSON.stringify(request),
        })
    )
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

    onRemoved(id, setState) {
        setState((state) => repository.removeOne(state, id))
    },
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
