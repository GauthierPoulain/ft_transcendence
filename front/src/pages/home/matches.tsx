import Visibility from "@mui/icons-material/Visibility"
import { OverlayTrigger, Table, Tooltip } from "react-bootstrap"
import UserAvatar from "../../components/user/UserAvatar"
import { Match, useMatches, useMatchesLoading } from "../../data/matches"
import { useUser } from "../../data/users"

function MatchComponent({ match }: { match: Match }) {
    const userOne = useUser(match.playerOneId)
    const userTwo = useUser(match.playerTwoId)

    return (
        <tr>
            <td>
                <UserAvatar userId={userOne.id} className="w-16 h-16" />
                { userOne.nickname }
            </td>
            <td>
                <UserAvatar userId={userTwo.id} className="w-16 h-16" />
                { userTwo.nickname }
            </td>
            <td>? - ?</td>
            <td>
                <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>View Match</Tooltip>}
                >
                    <Visibility className="game-view" />
                </OverlayTrigger>
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
                    <th>View</th>
                </tr>
            </thead>
            <tbody>
                { matches.map((match) => <MatchComponent key={match.id} match={match} /> ) }
            </tbody>
        </Table>
    )
}

export default function SectionMatches() {
    const loading = useMatchesLoading()

    return (
        <section>
            <h2>Matches in progress</h2>

            { loading ? <p>Loading...</p> : <Matches /> }
        </section>
    )
}
