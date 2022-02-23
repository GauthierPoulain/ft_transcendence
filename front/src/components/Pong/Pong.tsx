import React, { useEffect, useState } from "react"
import game from "./game"
import "./pong.css"
import { useWebSocket } from "../../data/use-websocket"
import { AuthState, useAuth } from "../../data/use-auth"
import useUser, { User } from "../../data/use-user"

function GameComponent(user: User | null) {
    const { subscribe, sendMessage } = useWebSocket()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        game(sendMessage)
        const unmount = () => {
            document.dispatchEvent(new CustomEvent("stopRendering"))
        }
        setIsLoading(false)
        return unmount
    }, [])

    useEffect(() => {
        if (!isLoading) {
            const { unsubscribe } = subscribe((event, data) => {
                console.log(event, data)
            })

            return unsubscribe
        }
    }, [isLoading])

    return (
        <React.Fragment>
            <div id="gameContainer">
                <div id="gameHud">
                    {user ? (
                        <span id="userIdentity">Welcome {user.nickname}</span>
                    ) : (
                        <span id="userIdentity">Welcome guest</span>
                    )}
                    <div className="identity" id="one">
                        <span className="name"></span>
                        <span className="score"></span>
                    </div>
                    <div className="identity" id="two">
                        <span className="name"></span>
                        <span className="score"></span>
                    </div>
                    <div id="bigAlert">
                        <p></p>
                    </div>
                </div>
                <canvas />
            </div>
        </React.Fragment>
    )
}

function AuthComponent(auth: AuthState) {
    const user = useUser(auth.userId!)
    return GameComponent(user)
}

export default function Pong() {
    const auth = useAuth()
    return auth.connected ? AuthComponent(auth) : GameComponent(null)
}
