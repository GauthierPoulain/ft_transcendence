import "./topbar.css"
import { Link } from "react-router-dom"
import { Home } from "@material-ui/icons"
import { Person } from "@material-ui/icons"
import { useAuth } from "../../services/auth"
import { api } from "../../services"
import { User } from "../../services/users"

function UserProfilePic({ userId }) {
    const { data: user, isSuccess } = api.endpoints.getUser.useQuery(userId)
    const src = isSuccess ? (user as User).image : "/assets/42.jpg"
    console.log(user)

    return <img src={src} className="topbarImg" />
}

function ProfilePic() {
    const auth = useAuth()

    if (auth.connected) {
        return <UserProfilePic userId={auth.userId} />
    }

    return <img src="/assets/42.jpg" className="topbarImg" />
}

export default function Topbar() {

    const auth = useAuth();
    const id = auth.userId;

    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to="/" className="logo">
                    <span className="logo">ft_pong</span>
                </Link>
            </div>

            <div className="topbarCenter">
                <div className="topbarLinks">
                    <Link to="/leaderboard" className="links">
                        <span>Leaderboard</span>
                    </Link>
                    <Link to="/chat" className="links">
                        <span>Chat</span>
                    </Link>
                </div>
            </div>

            <div className="topbarRight">
                <div className="topbarLinks">
                    <Link to="/" className="links">
                        <Home />
                    </Link>
                    <Link to={"/users/" + id} className="links">
                        <Person />
                    </Link>
                </div>
                <ProfilePic />
            </div>
        </div>
    )
}
