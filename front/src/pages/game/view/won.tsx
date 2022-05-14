import { Container } from "react-bootstrap"
import { useMatch } from "../../../data/matches"
import { useUser } from "../../../data/users"

export default function GameViewWon({ gameId }) {
    const match = useMatch(gameId)!

    const playerOne = useUser(match.playerOneId)!
    const playerTwo = useUser(match.playerTwoId)!

    const winner = match.state === "player_one_won" ? playerOne : playerTwo
    const looser = match.state === "player_one_won" ? playerTwo : playerOne

    return (
        <Container className="mt-3">
            <h2>Game {match.id} finished</h2>

            <p>
                The game was won by {winner.nickname} and lost by{" "}
                {looser.nickname}. It {match.matchmaking ? "was" : "wasn't"} a
                matchmaking match.
            </p>
        </Container>
    )
}
