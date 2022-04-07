import { useContext } from "react"
import { createRepository } from "./repository"
import { createService } from "./service"
import { fetcher } from "./use-fetch"

export type Match = {
    id: number
    playerOneId: number
    playerTwoId: number
    matchmaking: boolean
    state: "waiting" | "playing" | "player_one_won" | "player_two_won"
    scorePOne: number
    scorePTwo: number
}

const repository = createRepository<Match>()

const service = createService<Match, void>({
    name: "matches",
    repository,

    fetcher() {
        return fetcher("/matches")
    },

    onCreated(data, setState) {
        setState((state) => repository.addOne(state, data))
    },

    onUpdated(data, setState) {
        setState((state) => repository.updateOne(state, data))
    },

    onRemoved(id, setState) {
        setState((state) => repository.removeOne(state, id))
    },
})

export const MatchesProvider = service.Provider

export function useMatchesLoading(): boolean {
    return useContext(service.Context).loading
}

export function useMatch(matchId: number): Match | undefined {
    const { state } = useContext(service.Context)

    return repository.selectById(state, matchId)
}

export function useMatches(): Match[] {
    const { state } = useContext(service.Context)

    return repository.selectAll(state)
}
