import { useContext } from "react"
import { fetcher } from "./use-fetch"
import { Membership } from "./use-member"
import { createRepository } from "./repository"
import { createService } from "./service"

const repository = createRepository<Membership>()

const service = createService<Membership, number>({
    name: "members",
    repository,

    fetcher(channelId) {
        return fetcher(`/channels/${channelId}/members`)
    },

    onCreated(data, setState, channelId) {
        if (data.channelId === channelId) {
            setState((state) => repository.addOne(state, data))
        }
    },

    onUpdated(data, setState) {
        setState((state) => repository.updateOne(state, data))
    },

    onRemoved(id, setState) {
        setState((state) => repository.removeOne(state, id))
    },
})

export const MembersProvider = service.Provider

export function useMembers(): Membership[] {
    const { state } = useContext(service.Context)

    return repository.selectAll(state)
}

export function useMemberByUser(userId: number): Membership | undefined {
    return useMembers().find((member) => member.userId === userId)
}

export function useMembersLoading(): boolean {
    return useContext(service.Context).loading
}
