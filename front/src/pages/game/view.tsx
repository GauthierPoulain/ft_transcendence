import { useParams } from "react-router-dom"

export default function GameView() {
    const params = useParams()
    const gameId = parseInt(params.gameId as string, 10)

    return (
        <p>{ gameId }</p>
    )
}
