import { Container } from "react-bootstrap"
import LeaderboardTab from "../../components/LeaderboardTab/LeaderboardTab"

export default function Leaderboard() {
    return (
        <Container className="mt-3">
            <h2>Leaderboard</h2>
            <LeaderboardTab />
        </Container>
    )
}
