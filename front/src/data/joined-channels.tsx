import { createContext, useContext, useEffect, useState } from "react"
import { fetcher } from "./use-fetch"
import { Membership } from "./use-member"
import { Channel, useChannels } from "./channels"
import { useWebSocket } from "./use-websocket"
import { State, createRepository } from "./repository"
import { useAuth } from "./use-auth"

const repository = createRepository<Membership>()

const Context = createContext<{ state: State<Membership>, loading: boolean }>(undefined)

export function JoinedChannelsProvider({ children }) {
    const auth = useAuth()
    const { subscribe } = useWebSocket()
    const [state, setState] = useState(repository.initialState())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setState(repository.initialState())

        fetcher(`/members`).then((response) => {
            setState(repository.setAll(response))
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (loading) return;

        const { unsubscribe } = subscribe((event, data) => {
            if (event === "members.created") {
                if (data.userId === auth.userId) {
                    setState((state) => repository.addOne(state, data))
                }
            }

            if (event === "members.removed") {
                if (data.userId === auth.userId) {
                    setState((state) => repository.removeOne(state, data.id))
                }
            }
        })

        return unsubscribe
    }, [loading])

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

export function useJoinedChannels(): Channel[] {
    const { state } = useContext(Context)

    const channels = useChannels()
    const members = repository.selectAll(state)

    return channels.filter(({ id }) => {
        return members.some(({ channelId }) => id === channelId)
    })
}

export function useJoinedChannelsLoading(): boolean {
    return useContext(Context).loading
}
