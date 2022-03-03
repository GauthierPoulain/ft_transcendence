import { fetcher, useSubmit } from "./use-fetch"

export type Membership = {
    id: number
    role: string
    channelId: number
    userId: number
    muted: boolean
}

export type RemoveMemberRequest = {
    id: number
}

export function useRemoveMember() {
    return useSubmit<RemoveMemberRequest, Membership>(({ id }) =>
        fetcher(
            `/members/${id}`,
            {
                method: "DELETE",
            },
            false
        )
    )
}

export type UpdateMemberRequest = {
    id: number
    action: "mute" | "unmute" | "promote" | "demote"
}

export function useUpdateMember() {
    return useSubmit<UpdateMemberRequest, Membership>(({ id, action }) =>
        fetcher(
            `/members/${id}`,
            {
                method: "PUT",
                body: JSON.stringify({ action }),
            },
            false
        )
    )
}
