import useFetch from "./use-fetch"

export type User = {
    id: number
    intra_login: string
    nickname: string
    image: string
}

export default function useUser(id: number): User {
    return useFetch(`/users/${id}`)
}
