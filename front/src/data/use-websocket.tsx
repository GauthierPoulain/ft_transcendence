import { createContext, useContext, useEffect, useState } from "react";
import useInner, { ReadyState } from "react-use-websocket"
import { mutate } from "swr"
import { Message } from "./use-message";

type State = {
    sendMessage: any,
    readyState: ReadyState
}

const Context = createContext<State>({} as State)

export function WebsocketProvider({ children }) {
    const { sendMessage: send, readyState } = useInner("ws://localhost:3005", {
        onMessage(message) {
            const { event, data } = JSON.parse(message.data)

            if (event === "channel.message.new") {
                const message = data as Message

                mutate(`/channels/${message.channelId}/messages`, (messages: Message[] | null) => {
                    if (messages) {
                        return [...messages, message]
                    }

                    return messages
                }, false)
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
        <Context.Provider value={{ sendMessage, readyState }}>
            { children }
        </Context.Provider>
    )
}

export function useWebSocket() {
    return useContext(Context)
}