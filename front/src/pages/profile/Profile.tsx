import { useAuth } from "../../auth"
import { useResource } from "rest-hooks";
import { UserResource } from "../../api/resources/UserResource"
import Topbar from "../../components/topbar/Topbar"
import "./profile.css"

function ProfileConnected() {
	const user = useResource(UserResource.current(), {})

    return (
        <div>
            <div className="profileContainer">
                <a href="https://42lyon.fr" target="_blank">
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
		return <p>You're not connected</p>
	}

	return <ProfileConnected />
}

export default Profile;
