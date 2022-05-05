import { useParams } from "react-router-dom"
import { ErrorBox } from "../../components/error/ErrorBox"
import Pong from "../../components/Pong/Pong"
import { useMatch } from "../../data/matches"
import { HttpError } from "../../errors/HttpError"
import GameViewWaiting from "./view/waiting"
import GameViewWon from "./view/won"

export default function GameView() {
    const params = useParams()
    const gameId = parseInt(params.gameId as string, 10)
    const match = useMatch(gameId)

    if (!match) {
        return <ErrorBox error={new HttpError(404)} />
    }

    if (match.state === "waiting") {
        return <GameViewWaiting matchId={match.id} />
    }

    if (match.state === "playing") {
        return <Pong gameId={gameId} />
    }

    return <GameViewWon gameId={match.id} />
}
