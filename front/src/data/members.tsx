import { useContext } from "react"
import { fetcher } from "./use-fetch"
import { Membership } from "./use-member"
import { createRepository } from "./repository"
import { createService } from "./service"

const repository = createRepository<Membership>()

type ProviderSettings = {
    channelId: number
}

const service = createService<Membership, ProviderSettings>({
    name: "members",
    repository,

    fetcher({ channelId }) {
        return fetcher(`/channels/${channelId}/members`)
    },

    onCreated(data, setState, { channelId }) {
        if (data.channelId === channelId) {
            setState((state) => repository.addOne(state, data))
        }
    },

    onRemoved(data, setState, { channelId }) {
        if (data.channelId === channelId) {
            setState((state) => repository.removeOne(state, data.id))
        }
    }
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
