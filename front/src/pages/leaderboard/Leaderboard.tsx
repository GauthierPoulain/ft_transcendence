import LeaderboardTab from "../../components/LeaderboardTab/LeaderboardTab"
import "./leaderboard.css";
import { useAuth } from "../../auth";
import { Navigate } from "react-router-dom";

function Leaderboard() {

    const auth = useAuth();

    if (!auth.connected)
    {
        return (
            <Navigate to="/auth"/>
        )
    }

    return (
        <div>
            <LeaderboardTab />
        </div>
    );
}

export default Leaderboard;
