import Visibility from "@mui/icons-material/Visibility"
import { OverlayTrigger, Table, Tooltip } from "react-bootstrap"
import { Link } from "react-router-dom"
import UserAvatar from "../../components/user/UserAvatar"
import { Match, useMatches, useMatchesLoading } from "../../data/matches"
import { useUser } from "../../data/users"

function MatchComponent({ match }: { match: Match }) {
    const userOne = useUser(match.playerOneId)
    const userTwo = useUser(match.playerTwoId)

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
            <td>? - ?</td>
            <td>
                <Link className="btn btn-light" to={`/game/${match.id}`}>
                    View
                </Link>
            </td>
        </tr>
    )
}

function Matches() {
    const matches = useMatches()

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
                {matches.map((match) => (
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

            {loading ? <p>Loading...</p> : <Matches />}
        </section>
    )
}
