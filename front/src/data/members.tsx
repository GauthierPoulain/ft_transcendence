import { createContext, useContext, useEffect, useState } from "react"
import { fetcher } from "./use-fetch"
import { Membership } from "./use-member"
import { useWebSocket } from "./use-websocket"

interface Entity {
    id: number
}

export type State<T> = {
    entities: Map<number, T>
}

export type Repository<T> = {
    addOne(state: State<T>, entity: T): State<T>
    addMany(state: State<T>, entities: T[]): State<T>

    setAll(entities: T[]): State<T>

    removeOne(state: State<T>, id: number): State<T>

    initialState(): State<T>

    selectAll(state: State<T>): T[]
}

export function createRepository<T extends Entity>(): Repository<T> {
    function addMany(state: State<T>, entities: T[]): State<T> {
        const new_state = {
            entities: new Map(state.entities)
        }

        for (const entity of entities) {
            new_state.entities.set(entity.id, entity)
        }

        return new_state
    }

    function removeOne(state: State<T>, id: number): State<T> {
        const new_state = {
            entities: new Map(state.entities)
        }

        new_state.entities.delete(id)

        return new_state
    }
    
    function initialState() {
        return { entities: new Map() }
    }

    return {
        addMany,
        addOne: (state, entity) => addMany(state, [entity]),

        setAll: (entities) => addMany(initialState(), entities),

        removeOne,

        initialState,

        selectAll: (state) => [...state.entities.values()]
    }
}

const membersRepository = createRepository<Membership>()

const Context = createContext<{ state: State<Membership>, loading: boolean }>(undefined)

export function MembersProvider({ channelId, children }) {
    const { subscribe } = useWebSocket()
    const [state, setState] = useState(membersRepository.initialState())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)

        fetcher(`/channels/${channelId}/members`).then((response) => {
            setState(membersRepository.setAll(response))
            setLoading(false)
        })
    }, [channelId])

    useEffect(() => {
        if (loading) return;

        const { unsubscribe } = subscribe((event, data) => {
            console.log(event, data)
            if (event === "members.created") {
                if (data.channelId === channelId) {
                    setState((state) => membersRepository.addOne(state, data))
                }
            }

            if (event === "members.removed") {
                if (data.channelId === channelId) {
                    setState((state) => membersRepository.removeOne(state, data.id))
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

    return membersRepository.selectAll(state)
}

export function useMemberByUser(userId: number): Membership | undefined {
    return useMembers().find((member) => member.userId === userId)
}

export function useMembersLoading(): boolean {
    return useContext(Context).loading
}
