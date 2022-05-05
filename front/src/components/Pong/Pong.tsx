import React, { useEffect, useRef } from "react"
import Game from "./game"
import "./pong.css"
import { useWebSocket } from "../../data/use-websocket"
import { AuthState, useAuth } from "../../data/use-auth"
import useUser, { User } from "../../data/use-user"

function GameComponent(user: User | null, gameId: number) {
    const { subscribe, sendMessage } = useWebSocket()
    const localInstance = useRef<Game | null>(null)
    const gameContainer = useRef<null | HTMLObjectElement>(null)
    const useEffectOnce = (effect: () => void | (() => void)) => {
        const destroyFunc = useRef<void | (() => void)>()
        const calledOnce = useRef(false)
        const renderAfterCalled = useRef(false)
        if (calledOnce.current) renderAfterCalled.current = true
        useEffect(() => {
            calledOnce.current = true
            destroyFunc.current = effect()
            return () => {
                if (!renderAfterCalled.current) return
                else if (destroyFunc.current) destroyFunc.current()
            }
        }, [])
    }

    useEffect(() => {
        localInstance.current = new Game(sendMessage, gameContainer.current!)
        const unmount = () => {
            localInstance.current?.killEngine()
            localInstance.current = null
        }
        return unmount
    }, [])

    useEffectOnce(() => {
        const { unsubscribe } = subscribe((event, data) => {
            localInstance.current?.socketEvents(event, data)
        })
        sendMessage("socket.game.ready", { gameId: gameId })
        localInstance.current?.setReady({ ws: true })
        return () => {
            sendMessage("game:disconnect", null)
            unsubscribe()
        }
    })

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
            <div id="endGameContainer">
                <div id="endGame">
                    <h2 id="mainText">X win the game</h2>
                    <p id="score">2 - 0</p>
                </div>
            </div>
        </React.Fragment>
    )
}

function AuthComponent(auth: AuthState, gameId: number) {
    const user = useUser(auth.userId!)!
    return GameComponent(user, gameId)
}

export default function Pong(props: { gameId: number }) {
    const auth = useAuth()
    return auth.connected
        ? AuthComponent(auth, props.gameId)
        : GameComponent(null, props.gameId)
}
