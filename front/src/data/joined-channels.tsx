import { useContext } from "react"
import { fetcher } from "./use-fetch"
import { Membership } from "./use-member"
import { Channel, useChannels } from "./channels"
import { createRepository } from "./repository"
import { createService } from "./service"

const repository = createRepository<Membership>()

const service = createService<Membership, number>({
    name: "members",
    repository,

    fetcher() {
        return fetcher("/members")
    },

    onCreated(data, setState, userId) {
        if (data.userId === userId) {
            setState((state) => repository.addOne(state, data))
        }
    },

    onRemoved(id, setState) {
        setState((state) => repository.removeOne(state, id))
    },
})

export const JoinedChannelsProvider = service.Provider

export function useJoinedChannels(): Channel[] {
    const { state } = useContext(service.Context)

    const channels = useChannels()
    const members = repository.selectAll(state)

    return channels.filter(({ id }) => {
        return members.some(({ channelId }) => id === channelId)
    })
}

export function useJoinedChannelsLoading(): boolean {
    return useContext(service.Context).loading
}
