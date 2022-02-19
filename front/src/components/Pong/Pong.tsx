import React, { useEffect, useState } from "react"
import game from "./game"
import "./pong.css"
import { useWebSocket } from "../../data/use-websocket"
import { useAuth } from "../../data/use-auth"
import useUser from "../../data/use-user"

export default function Pong() {
    const { subscribe, sendMessage } = useWebSocket()
    const [isLoading, setLoading] = useState(true)
    const auth = useAuth()
    // const user = auth ? useUser(auth.userId!) : undefined

    useEffect(() => {
        if (isLoading) return

        const { unsubscribe } = subscribe((event, data) => {
            console.log(event, data)
        })

        return unsubscribe
    }, [isLoading])

    function stopRendering() {
        document.dispatchEvent(new CustomEvent("stopRendering"))
    }

    useEffect(() => {
        console.log("mount")
        console.log(auth)
        // console.log(user)

        sendMessage("salut", "owomg")

        game()
        return stopRendering
    }, [])

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
        </React.Fragment>
    )
}
