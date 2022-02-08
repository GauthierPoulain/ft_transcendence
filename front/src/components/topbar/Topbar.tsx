import "./topbar.css"
import { Link } from 'react-router-dom'
import { Home } from '@material-ui/icons'
import { Person } from '@material-ui/icons'
import { useAuth } from "../../auth";
import { useResource } from "rest-hooks";
import { UserResource } from "../../api/resources/UserResource";
import { userInfo } from "os";

function ProfilePic()
{
    const user = useResource(UserResource.current(), {});

    return (
        <img src={user.intra_image_url} className="topbarImg" alt="" />
    ) 
}

function GetProfilePic()
{
    const auth = useAuth();

    if (!auth.connected)
    {
        return(
            <img src="/assets/42.jpg" className="topbarImg" alt="" />
        );
    }

    return(
        <ProfilePic />
    );
}

function Topbar() {
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
                    <Link to="/profile" className="links">
                        <Person />
                    </Link>
                </div>
                <GetProfilePic />
            </div>
        </div>
    )
}

export default Topbar;