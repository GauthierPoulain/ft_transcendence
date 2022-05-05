import { useContext } from "react"
import { createRepository } from "./repository"
import { createService } from "./service"
import { fetcher } from "./use-fetch"

export type Achievements = {
    win_one_match: boolean
    channel_join: boolean
    channel_create: boolean
    follow_someone: boolean
    block_someone: boolean
}

export type User = {
    id: number
    nickname: string
    has_custom_image: boolean
    image: string
    tfa: boolean
    achievements: Achievements
}

const repository = createRepository<User>()

const service = createService<User, void>({
    name: "users",
    repository,

    fetcher() {
        return fetcher("/users")
    },

    onCreated(data, setState) {
        setState((state) => repository.addOne(state, data))
    },

    onUpdated(data, setState) {
        setState((state) => repository.updateOne(state, data))
    },
})

export const UsersProvider = service.Provider

export function useUsersLoading(): boolean {
    return useContext(service.Context).loading
}

export function useUser(id: number): User | undefined {
    const { state } = useContext(service.Context)

    return repository.selectById(state, id)
}
