import { createContext, useContext, useState } from "react";
import useInner, { ReadyState } from "react-use-websocket"
import { mutate } from "swr"
import { Message } from "./use-message";
import { Membership } from "./use-member"
import { useAuth } from "./use-auth";

type State = {
    sendMessage: any,
    readyState: ReadyState,
    lastJsonMessage?: {
        event: string,
        data: any
    },
    setHandlers: any,
    subscribe: (fn: (key: string, value: any) => void) => {
        unsubscribe: () => void
    }
}

const Context = createContext<State>({} as State)

export function WebsocketProvider({ children }) {
    const auth = useAuth()

    const [handlers, setHandlers] = useState(new Map())

    const { sendMessage: send, readyState, lastJsonMessage } = useInner(`ws://${document.location.hostname}:3005`, {
        async onMessage(message) {
            const { event, data } = JSON.parse(message.data)



            console.log("websocket message", event, data, handlers)

            handlers.forEach((value) => value(event, data))

            if (event === "members.created") {
                const member = data as Membership

                mutate(`/channels/${member.channelId}/members`)
                if (auth.userId === data.userId) {
                    mutate(`/channels/joined`)
                }
            } else if (event === "members.removed") {
                mutate(`/channels/${data.channelId}/members`)
                if (auth.userId === data.userId) {
                    mutate(`/channels/joined`)
                }
            } else {
                console.log("Unhandled websocket message", event)
            }
        },

        onError(error) {
            console.error("websocket error", error)
        },
        
        shouldReconnect: () => true
    })

    function sendMessage(event: string, data: any) {
        console.log("sending message")
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
            }
        }
    }

    return (
        <Context.Provider value={{ subscribe, setHandlers, sendMessage, readyState, lastJsonMessage }}>
            { children }
        </Context.Provider>
    )
}

export function useWebSocket() {
    return useContext(Context)
}
