import React, { useEffect } from "react"
import game from "./game"

export default function Pong() {
    useEffect(() => {
        game()
    }, [])
    return (
        <React.Fragment>
            <div id="gameContainer" />
        </React.Fragment>
    )
}
