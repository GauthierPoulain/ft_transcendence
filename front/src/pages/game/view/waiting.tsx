import { useEffect, useState } from "react"
import { Button, Container } from "react-bootstrap"
import { useMatch } from "../../../data/matches"
import { useAuth } from "../../../data/use-auth"
import { useWebSocket } from "../../../data/use-websocket"
import { useUser } from "../../../data/users"

function ReadyButton({ matchId }) {
    const [ready, setReady] = useState(false)
    const [error, setError] = useState(false)
    const { subscribe, sendMessage } = useWebSocket()

    useEffect(() => {
        if (!ready) {
            return
        }

        const { unsubscribe } = subscribe((event) => {
            if (event === "game.waiting.error.alreadysubscribed") {
                setError(true)
                setReady(false)
            }
        })

        sendMessage("game.waiting.ready", { id: matchId })

        return () => {
            sendMessage("game.waiting.unready", { id: matchId })
            unsubscribe()
        }
    }, [ready, matchId])

    if (error) {
        // TODO: Retry button?
        return <p>Already waiting in another session</p>
    }

    if (ready) {
        return <Button disabled>Waiting...</Button>
    }

    return <Button onClick={() => setReady(true)}>Ready</Button>
}

export default function GameViewWaiting({ matchId }) {
    const auth = useAuth()
    const match = useMatch(matchId)!
    const playerOne = useUser(match.playerOneId)!
    const playerTwo = useUser(match.playerTwoId)!

    return (
        <Container>
            <h2>Game waiting</h2>
            <p>Waiting for the match to start</p>
            <p>
                {playerOne.nickname} vs {playerTwo.nickname}
            </p>

            {auth.connected &&
                [playerOne.id, playerTwo.id].includes(auth.userId) && (
                    <ReadyButton matchId={match.id} />
                )}
        </Container>
    )
}
