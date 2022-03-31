import { useParams } from "react-router-dom"
import Pong from "../../components/Pong/Pong"
import { useMatch } from "../../data/matches"
import GameViewWaiting from "./view/waiting"

// TODO: 404 if useMatch is null
export default function GameView() {
    const params = useParams()
    const gameId = parseInt(params.gameId as string, 10)
    const match = useMatch(gameId)!

    if (match.state === "waiting") {
        return <GameViewWaiting matchId={match.id} />
    }

    return <Pong />
}
