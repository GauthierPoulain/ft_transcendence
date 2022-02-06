import { useAuth } from "../../auth"
import { useResource } from "rest-hooks";
import { UserResource } from "../../api/resources/UserResource"
import Topbar from "../../components/topbar/Topbar"
import { Link } from 'react-router-dom'
import "./profile.css"
import { Button } from 'react-bootstrap'

function ProfileConnected() {
	const user = useResource(UserResource.current(), {})
    const url = "https://profile.intra.42.fr/users/" + user.intra_login;

    return (
        <div>
            <div className="profileContainer">
                <a href={url} target="_blank">
                    <img src={user.intra_image_url} alt="" className="profilePicture"/>
                </a>
                <div className="profileName">
                    <span>{user.intra_login}</span>
                </div>
            </div>
        </div>
    )
}

function Profile() {
	const auth = useAuth();

	if (!auth.connected) {
		return (
            <div className="notConnected">
                <p>You're not connected</p>
                <Link to="/auth" className="links">
                    <Button>Sign in here !</Button>
                </Link>
            </div>
        )
	}

	return <ProfileConnected />
}

export default Profile;
