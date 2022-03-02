import { useContext } from "react"
import { createRepository } from "./repository"
import { createService } from "./service"
import { useAuth } from "./use-auth"
import { fetcher } from "./use-fetch"

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

    onRemoved(id, setState, connected) {
        if (connected) {
            setState((state) => repository.removeOne(state, id))
        }
    }
})

export const RelationsProvider = service.Provider;

export function useRelationsLoading(): boolean {
    return useContext(service.Context).loading
}

export function useRelations(): Relation[] {
    const { state } = useContext(service.Context);

    return repository.selectAll(state)
}

export function useIsFriend(userId: number): boolean {
    return useRelations().some(({ targetId, kind }) => kind === "friend" && targetId === userId)
}

export function useIsBlocked(userId: number): boolean {
    return useRelations().some(({ targetId, kind }) => kind === "blocked" && targetId === userId)
}
