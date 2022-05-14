import { createContext, useContext, useState } from "react"
import useInner, { ReadyState } from "react-use-websocket"

type State = {
    sendMessage: (event: string, data?: any) => void
    readyState: ReadyState
    lastJsonMessage?: {
        event: string
        data: any
    }
    setHandlers: any
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

export function WebsocketProvider({ children }) {
    const [handlers, setHandlers] = useState(new Map())

    console.log("websocket provider")

    const {
        sendMessage: send,
        readyState,
        lastJsonMessage,
    } = useInner(wsurl(), {
        onOpen() {
            console.debug("Websocket open")
        },

        async onMessage(message) {
            const { event, data } = JSON.parse(message.data)

            // console.debug("websocket message", event, data, handlers)

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

        setHandlers((map) => {
            const copy = new Map(map)
            copy.set(key, fn)
            return copy
        })

        return {
            unsubscribe() {
                setHandlers((map) => {
                    const copy = new Map(map)
                    copy.delete(key)
                    return copy
                })
            },
        }
    }

    return (
        <Context.Provider
            value={{
                subscribe,
                setHandlers,
                sendMessage,
                readyState,
                lastJsonMessage,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export function useWebSocket() {
    return useContext(Context)
}
