import LeaderboardTab from "../../components/LeaderboardTab/LeaderboardTab"
import "./leaderboard.css";
import { useAuth } from "../../auth";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Leaderboard() {

    const auth = useAuth();

    if (!auth.connected)
    {
        return (
            <div className="notConnected">
                <p>You're not connected</p>
                <Link to="/auth" className="links">
                    <Button>Sign in here !</Button>
                </Link>
            </div>
        )
    }

    return (
        <div>
            <LeaderboardTab />
        </div>
    );
}

export default Leaderboard;
