import { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useWebSocket } from "../../data/use-websocket"

export default function Matchmaking() {
    const navigate = useNavigate()
    const { subscribe, sendMessage } = useWebSocket()
    const [error, setError] = useState(false)

    useEffect(() => {
        const { unsubscribe } = subscribe((event, data) => {
            if (event === "game.waiting.error.alreadysubscribed") {
                setError(true)
            }

            if (event === "game.waiting.success") {
                navigate(`/game/${data.id}`, { replace: true })
            }
        })

        sendMessage("game.waiting.ready", { id: 0 })

        return () => {
            sendMessage("game.waiting.unready", { id: 0 })
            unsubscribe()
        }
    }, [])

    return (
        <Container className="mt-3">
            <h2>Matchmaking</h2>

            <p>{ error ? "You're already subscribed to a matchmaking on another window" : "Waiting another player to start a match! You can go back to the home page to stop waiting." }</p>
        </Container>
    )
}
