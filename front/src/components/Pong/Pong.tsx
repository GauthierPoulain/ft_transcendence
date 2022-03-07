import React, { useEffect, useRef } from "react"
import Game from "./game"
import "./pong.css"
import { useWebSocket } from "../../data/use-websocket"
import { AuthState, useAuth } from "../../data/use-auth"
import useUser, { User } from "../../data/use-user"

function GameComponent(user: User | null) {
    const { subscribe, sendMessage } = useWebSocket()
    const gameContainer = useRef<null | HTMLObjectElement>(null)

    useEffect(() => {
        const localInstance = new Game(sendMessage, gameContainer.current!)
        const { unsubscribe } = subscribe((event, data) => {
            localInstance.socketEvents(event, data)
        })
        localInstance.setReady({ ws: true })

        const unmount = () => {
            localInstance?.killEngine()
            sendMessage("game:disconnect", null)
            unsubscribe()
        }
        return unmount
    }, [])

    return (
        <React.Fragment>
            <div id="gameContainer" ref={gameContainer}>
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
