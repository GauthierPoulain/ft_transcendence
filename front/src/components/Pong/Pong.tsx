import React, { useEffect, useState } from "react"
import game from "./game"
import "./pong.css"
import { useWebSocket } from "../../data/use-websocket"
import { useAuth } from "../../data/use-auth"
import useUser, { User } from "../../data/use-user"

function UserComponent({ userId, setUser, setUserReady }) {
    const user = useUser(userId)
    console.log(user)
    setUser(user)
    setUserReady(true)
    return <React.Fragment />
}

export default function Pong() {
    const { subscribe, sendMessage } = useWebSocket()
    const [isLoading, setLoading] = useState(true)
    const auth = useAuth()
    const [user, setUser] = useState<null | User>(null)
    const [userReady, setUserReady] = useState(false)

    useEffect(() => {
        if (isLoading) return

        const { unsubscribe } = subscribe((event, data) => {
            console.log(event, data)
        })

        return unsubscribe
    }, [isLoading])

    useEffect(() => {
        if (!userReady) return
        console.log("mount")

        sendMessage("salut", "owomg")

        game()

        const stopRendering = () => {
            document.dispatchEvent(new CustomEvent("stopRendering"))
        }

        return stopRendering
    }, [userReady])

    if (!userReady) {
        if (auth.connected) {
            UserComponent({
                userId: auth.userId,
                setUser: setUser,
                setUserReady: setUserReady,
            })
        } else setUserReady(true)
    } else
        return (
            <React.Fragment>
                <div id="gameContainer" style={{ display: "none" }}>
                    <div id="gameHud">
                        {user ? (
                            <span id="userIdentity">
                                Welcome {user.nickname}
                            </span>
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
                <div id="loadingContainer">
                    <h1>Loading...</h1>
                </div>
            </React.Fragment>
        )
}
