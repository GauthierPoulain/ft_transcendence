import React, { useEffect, useRef } from "react"
import Game from "./game"
import "./pong.css"
import { useWebSocket } from "../../data/use-websocket"

function GameComponent(gameId: number) {
    const { subscribe, sendMessage } = useWebSocket()
    const gameContainer = useRef<null | HTMLObjectElement>(null)

    useEffect(() => {
        const instance = new Game(sendMessage, gameContainer.current!)

        const { unsubscribe } = subscribe((event, data) => {
            if (event === "game:youAre") console.log("received who am i", instance)
            instance.socketEvents(event, data)
        })
        sendMessage("socket.game.ready", { gameId: gameId })
        instance.setReady({ ws: true })
        return () => {
            sendMessage("game:disconnect", null)
            unsubscribe()
            instance.killEngine()
        }
    }, [gameId])

    return (
        <React.Fragment>
            <div id="gameContainer" ref={gameContainer}>
                <div id="gameHud">
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

export default function Pong(props: { gameId: number }) {
    return GameComponent(props.gameId)
}
