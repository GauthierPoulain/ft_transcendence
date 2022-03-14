import { useContext } from "react"
import { createRepository } from "./repository"
import { createService } from "./service"
import { useAuth } from "./use-auth"
import { fetcher, fetcherPost, useSubmit } from "./use-fetch"

export type Relation = {
    id: number
    currentId: number
    targetId: number
    kind: "blocked" | "friend"
}

const repository = createRepository<Relation>()

const service = createService<Relation, boolean>({
    name: "relations",
    repository,

    fetcher(connected) {
        return connected ? fetcher("/relations") : Promise.resolve([])
    },

    onCreated(data, setState, connected) {
        if (connected) {
            setState((state) => repository.addOne(state, data))
        }
    },

    onRemoved(id, setState) {
        setState((state) => repository.removeOne(state, id))
    }
})

export const RelationsProvider = service.Provider;

export function useRelationsLoading(): boolean {
    return useContext(service.Context).loading
}

export function useRelations() {
    const auth = useAuth()
    const { state } = useContext(service.Context);
    const relations = repository.selectAll(state)

    const friends = relations.filter(({ kind, currentId }) => kind === "friend" && currentId === auth.userId)
    const blocked = relations.filter(({ kind, currentId }) => kind === "blocked" && currentId === auth.userId)

    return {
        relations,
        friends,
        blocked,

        isBlockedBy: (userId: number): boolean => relations.some(
            ({ currentId, targetId, kind }) => currentId === userId && targetId === auth.userId && kind === "blocked"
        ),
    }
}

export function useRelation(userId: number) {
    const { friends, blocked, isBlockedBy } = useRelations()

    return {
        isBlockedBy: isBlockedBy(userId),

        isBlocking: blocked.some(({ targetId }) => targetId === userId),

        isFriendWith: friends.some(({ targetId }) => targetId === userId),

        block: useMutateRelation(userId, "block"),
        unblock: useMutateRelation(userId, "unblock"),
        friend: useMutateRelation(userId, "friend"),
        unfriend: useMutateRelation(userId, "unfriend")
    }
}

export function useMutateRelation(userId: number, action: "friend" | "unfriend" | "block" | "unblock") {
    return useSubmit(() => fetcherPost("/relations", { targetId: userId, action }))
}
