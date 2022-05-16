import { Container, Table } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import UserAvatar from "../../../components/user/UserAvatar"
import { useMatches } from "../../../data/matches"
import { useAuth } from "../../../data/use-auth"
import { useUser } from "../../../data/users"

function GetRow({
    oponnent,
    winner,
    scoreYou,
    scoreOponnent,
    matchmaking
}: {
    oponnent: number
    winner: number
    scoreYou: number
    scoreOponnent: number,
    matchmaking: boolean
}) {
    const userOponnent = useUser(oponnent)!
    const userWin = useUser(winner)!

    return (
        <tr
            className={
                userWin === userOponnent ? "MatchTableDefeat" : "MatchTableWin"
            }
        >
            <td className="align-middle fs-5">
                <UserAvatar userId={userOponnent.id} className="w-8 h-8 me-2" />
                <Link
                    to={`/users/${userOponnent.id}`}
                    className="text-decoration-none align-middle"
                >
                    <span className="align-middle">{ userOponnent.nickname }</span>
                </Link>
            </td>
            <td className="align-middle fs-5">
                <UserAvatar userId={userWin.id} className="w-8 h-8 me-2" />
                {userWin === userOponnent ? (
                    <Link
                        to={`/users/${userOponnent.id}`}
                        className="text-decoration-none align-middle"
                    >
                        {userOponnent.nickname}
                    </Link>
                ) : (
                    <span className="align-middle">{ userWin.nickname }</span>
                )}
            </td>
            <td className="align-middle fs-5 text-center">{scoreYou}</td>
            <td className="align-middle fs-5 text-center">{scoreOponnent}</td>
            <td className="align-middle fs-5 text-center">{matchmaking ? "Yes" : "No"}</td>
        </tr>
    )
}

export default function Matches() {
    const { userId } = useParams()
    const user = useUser(parseInt(userId as string, 10))!
    const matches = useMatches()
    const auth = useAuth()
    const isCurrentUser = auth.connected && auth.userId === (userId as any)

    return (
        <Container>
            <h2>Matches</h2>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Against</th>
                        <th>Winner</th>
                        <th>
                            {isCurrentUser ? "Your" : user.nickname + "'s"}{" "}
                            score
                        </th>
                        <th>Opponent score</th>
                        <th>Matchmaking</th>
                    </tr>
                </thead>
                <tbody>
                    {[...matches].reverse().filter(
                        (match) => [match.playerOneId, match.playerTwoId].includes(user.id) && ["player_two_won", "player_one_won"].includes(match.state)
                    ).map((match) => (
                        <GetRow
                            key={match.id}
                            oponnent={
                                match.playerOneId === user.id
                                    ? match.playerTwoId
                                    : match.playerOneId
                            }
                            winner={
                                match.state === "player_one_won"
                                    ? match.playerOneId
                                    : match.playerTwoId
                            }
                            scoreYou={
                                match.playerOneId === user.id
                                    ? match.scorePOne
                                    : match.scorePTwo
                            }
                            scoreOponnent={
                                match.playerOneId === user.id
                                    ? match.scorePTwo
                                    : match.scorePOne
                            }
                            matchmaking={match.matchmaking}
                        />
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}
