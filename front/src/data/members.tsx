import { createContext, useContext, useEffect, useState } from "react"
import { fetcher } from "./use-fetch"
import { Membership } from "./use-member"
import { useWebSocket } from "./use-websocket"
import { State, createRepository } from "./repository"

const repository = createRepository<Membership>()

const Context = createContext<{ state: State<Membership>, loading: boolean }>(undefined)

export function MembersProvider({ channelId, children }) {
    const { subscribe } = useWebSocket()
    const [state, setState] = useState(repository.initialState())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setState(repository.initialState())

        fetcher(`/channels/${channelId}/members`).then((response) => {
            setState(repository.setAll(response))
            setLoading(false)
        })
    }, [channelId])

    useEffect(() => {
        if (loading) return;

        const { unsubscribe } = subscribe((event, data) => {
            if (event === "members.created") {
                if (data.channelId === channelId) {
                    setState((state) => repository.addOne(state, data))
                }
            }

            if (event === "members.removed") {
                if (data.channelId === channelId) {
                    setState((state) => repository.removeOne(state, data.id))
                }
            }
        })

        return unsubscribe
    }, [channelId, loading])

    const value = {
        loading,
        state
    }

    return (
        <Context.Provider value={value}>
            { children }
        </Context.Provider>
    )
}

export function useMembers(): Membership[] {
    const { state } = useContext(Context)

    return repository.selectAll(state)
}

export function useMemberByUser(userId: number): Membership | undefined {
    return useMembers().find((member) => member.userId === userId)
}

export function useMembersLoading(): boolean {
    return useContext(Context).loading
}
