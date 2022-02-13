import useFetch from "./use-fetch"

export type Membership = {
    id: number
    role: string
    channelId: number
    userId: number
}

export function useMembers(channelId: number): Membership[] {
    return useFetch(`/channels/${channelId}/members`)
}
