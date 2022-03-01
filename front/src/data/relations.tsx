import { createRepository } from "./repository"
import { createService } from "./service"
import { fetcher } from "./use-fetch"

export type Relation = {
    id: number
    currentId: number
    targetId: number
    kind: "blocked" | "friend"
}

const repository = createRepository<Relation>()

const service = createService<Relation, void>({
    name: "relations",
    repository,

    fetcher() {
        return fetcher("/relations")
    },

    onCreated(data, setState) {
        setState((state) => repository.addOne(state, data))
    },

    onRemoved(id, setState) {
        setState((state) => repository.removeOne(state, id))
    }
})
