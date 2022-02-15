import React, { useEffect } from "react"
import game from "./game"
import "./pong.css"

export default function Pong() {
    useEffect(() => {
        game()
    }, [])
    return (
        <div id="gameContainer">
            <div id="gameHud">
                <div id="gameSeparator" />
                <div className="identity" id="one">
                    <span className="name"></span>
                    <span className="score"></span>
                </div>
                <div className="identity" id="two">
                    <span className="name"></span>
                    <span className="score"></span>
                </div>
            </div>
            <canvas />
        </div>
    )
}
