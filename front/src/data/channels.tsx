import { createContext, useContext, useEffect, useState } from "react"
import { fetcher, useSubmit } from "./use-fetch"
import { Membership } from "./use-member"
import { createRepository, State } from "./repository"
import { useWebSocket } from "./use-websocket"

export type Channel = {
    id: number
    name: string
    type: "public" | "private" | "protected"
}

export type CreateChannelRequest = {
    name: string,
    joinable: boolean,
    password: string
}

export function createChannel(request: CreateChannelRequest): Promise<Channel> {
    return fetcher("/channels", {
        method: "POST",
        body: JSON.stringify(request)
    })
}

export type JoinChannelRequest = {
    channelId: number,
    password: string
}

export function useJoinChannel() {
    return useSubmit<JoinChannelRequest, Membership>((request) => fetcher(`/members`, {
        method: 'POST',
        body: JSON.stringify(request)
    }))
}

const repository = createRepository<Channel>()
const Context = createContext<{ state: State<Channel>, loading: boolean }>(undefined)

export function ChannelsProvider({ children }) {
    const { subscribe } = useWebSocket()
    const [state, setState] = useState(repository.initialState())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setState(repository.initialState())

        fetcher("/channels").then((response) => {
            setState(repository.setAll(response))
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (loading) return;

        const { unsubscribe } = subscribe((event, data) => {
            if (event === "channels.created") {
                setState((state) => repository.addOne(state, data))
            }

            if (event === "channels.removed") {
                setState((state) => repository.removeOne(state, data.id))
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

export function useChannels(): Channel[] {
    const { state } = useContext(Context)

    return repository.selectAll(state)
}

export function useChannelsLoading(): boolean {
    return useContext(Context).loading
}

export function useChannel(id: number): Channel | undefined {
    const { state } = useContext(Context)

    return repository.selectById(state, id)
}
