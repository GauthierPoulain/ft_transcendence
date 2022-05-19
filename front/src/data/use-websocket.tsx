import { createContext, useContext } from "react"
import useInner, { ReadyState } from "react-use-websocket"

type State = {
    sendMessage: (event: string, data?: any) => void
    readyState: ReadyState
    subscribe: (fn: (key: string, value: any) => void) => {
        unsubscribe: () => void
    }
}

const wsurl = () => {
    if (process.env["NODE_ENV"] === "production")
        return `ws://${document.location.hostname}/ws`
    else return `ws://${document.location.hostname}:3005`
}

const Context = createContext<State>({} as State)

const handlers = new Map()

export function WebsocketProvider({ children }) {
    const {
        sendMessage: send,
        readyState,
    } = useInner(wsurl(), {
        onOpen() {
            console.debug("Websocket open")
        },

        async onMessage(message) {
            const { event, data } = JSON.parse(message.data)

            handlers.forEach((value) => value(event, data))
        },

        onError(error) {
            console.error("websocket error", error)
        },

        shouldReconnect: () => true,
    })

    function sendMessage(event: string, data?: any) {
        return send(JSON.stringify({ event, data }))
    }

    function subscribe(fn: (event: string, data: any) => void) {
        const key = Symbol()

        handlers.set(key, fn)

        return {
            unsubscribe() {
                handlers.delete(key)
            },
        }
    }

    return (
        <Context.Provider
            value={{
                subscribe,
                sendMessage,
                readyState
            }}
        >
            {children}
        </Context.Provider>
    )
}

export function useWebSocket() {
    return useContext(Context)
}
