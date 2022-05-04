import { Table } from "react-bootstrap"
import { Link } from "react-router-dom"
import UserAvatar from "../../components/user/UserAvatar"
import { Match, useMatches, useMatchesLoading } from "../../data/matches"
import { useAuth } from "../../data/use-auth"
import { useUser } from "../../data/users"

function getMatchStatus(str: string, pOneNick: string, pTwoNick: string) {
    switch (str) {
        case "waiting":
            return "waiting"
        case "playing":
            return "playing"
        case "player_one_won":
            return pOneNick + " won"
        case "player_two_won":
            return pTwoNick + " won"
        default:
            return "bizarre"
    }
}

function MatchComponent({ match }: { match: Match }) {
    const userOne = useUser(match.playerOneId)!
    const userTwo = useUser(match.playerTwoId)!

    return (
        <tr>
            <td>
                <div className="d-flex align-items-center">
                    <UserAvatar userId={userOne.id} className="w-8 h-8 me-2" />
                    {userOne.nickname}
                </div>
            </td>
            <td>
                <div className="d-flex align-items-center">
                    <UserAvatar userId={userTwo.id} className="w-8 h-8 me-2" />
                    {userTwo.nickname}
                </div>
            </td>
            <td>
                {match.scorePOne} - {match.scorePTwo} (
                {getMatchStatus(
                    match.state,
                    userOne.nickname,
                    userTwo.nickname
                )}
                )
            </td>
            <td>
                <Link className="btn btn-light" to={`/game/${match.id}`}>
                    View
                </Link>
            </td>
        </tr>
    )
}

function Matches({ filter }) {
    const matches = useMatches().reverse()

    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>Player one</th>
                    <th>Player two</th>
                    <th>Score</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {matches.filter(filter).map((match) => (
                    <MatchComponent key={match.id} match={match} />
                ))}
            </tbody>
        </Table>
    )
}

export default function SectionMatches() {
    const loading = useMatchesLoading()

    return (
        <section>
            <h2>Matches in progress</h2>

            {loading ? <p>Loading...</p> : <Matches filter={({ state }) => state === "playing"} />}
        </section>
    )
}

export function SectionWaitingMatches() {
    const auth = useAuth()
    const loading = useMatchesLoading()

    function filter(match: Match): boolean {
        return match.state === "waiting" && (match.playerOneId === auth.userId || match.playerTwoId === auth.userId)
    }

    return (
        <section>
            <h2>Matches waiting for you</h2>

            {loading ? <p>Loading...</p> : <Matches filter={filter} />}
        </section>
    )
}
