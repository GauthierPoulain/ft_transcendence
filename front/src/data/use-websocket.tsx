import { createContext, useContext } from "react";
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
    }
}

const Context = createContext<State>({} as State)

export function WebsocketProvider({ children }) {
    const auth = useAuth()

    const { sendMessage: send, readyState, lastJsonMessage } = useInner("ws://localhost:3005", {
        async onMessage(message) {
            const { event, data } = JSON.parse(message.data)

            console.log("websocket message", event, data)

            if (event === "channel.message.new") {
                const message = data as Message

                mutate(`/channels/${message.channelId}/messages`, (messages: Message[] | null) => {
                    if (messages) {
                        return [...messages, message]
                    }

                    return messages
                }, false)
            } else if (event === "channel.message.remove") {
                mutate(`/channels/${data.channelId}/messages`, (messages: Message[] | null) => {
                    if (messages) {
                        return messages.filter(({ id }) => id !== data.id)
                    }

                    return messages
                }, false)
            } else if (event === "channel.member.new") {
                const member = data as Membership

                mutate(`/channels/${member.channelId}/members`)
                if (auth.userId === data.userId) {
                    mutate(`/channels/joined`)
                }
            } else if (event === "channel.member.remove") {
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

    return (
        <Context.Provider value={{ sendMessage, readyState, lastJsonMessage }}>
            { children }
        </Context.Provider>
    )
}

export function useWebSocket() {
    return useContext(Context)
}
