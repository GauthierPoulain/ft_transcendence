import React, { useEffect, useState } from "react"
import WebSocketService from "../../WebSocketService"
import game from "./game"
import "./pong.css"

export default function Pong() {
    const WSUrl = new URL(`ws://${document.location.hostname}:3005`)
    const [ws, setWs] = useState(new WebSocketService(WSUrl))

    useEffect(() => {
        console.log("mount")
        document.dispatchEvent(new CustomEvent("stopRendering"))
        ws.connect()
        return () => {
            ws.onClose(() => {
                console.log("ws disconnected")
            })
            ws.close()
        }
    }, [ws.onMessage, ws.onOpen, ws.onClose])

    return (
        <React.Fragment>
            <div id="gameContainer" style={{ display: "none" }}>
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
                        <p>
                            <span>Player 1</span> has scored
                        </p>
                    </div>
                </div>
                <canvas />
            </div>
            <div id="loadingContainer">
                <h1>Loading...</h1>
            </div>
            {game(ws)}
        </React.Fragment>
    )
}
