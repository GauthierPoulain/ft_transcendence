import React, { useEffect } from "react"
import game from "./game"
import "./pong.css"

export default function Pong() {
    useEffect(() => {
        game()
    }, [])
    return <div id="gameContainer" />
}
