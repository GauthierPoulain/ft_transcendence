import { useEffect } from "react"
import { useParams } from "react-router-dom"
import Pong from "../../components/Pong/Pong"

export default function GameView() {
    const params = useParams()
    const gameId = parseInt(params.gameId as string, 10)

    useEffect(() => {
        console.log(`Lobby: ${gameId}`)
    }, [])

    return <Pong />
}
