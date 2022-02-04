import { useResource } from "rest-hooks";
import { UserResource } from "../../api/resources/UserResource"
import Topbar from "../../components/topbar/Topbar"
import "./profile.css"

function Profile() {
	const user = useResource(UserResource.current(), {})

    return (
        <div>
            <div className="profileContainer">
                <a href="https://42lyon.fr" target="_blank">
                    <img src={user.intra_image_url} alt="" className="logo"/>
                </a>
                <div className="profileName">
                    <span>{user.intra_login}</span>
                </div>
            </div>
        </div>
    )
}

export default Profile;
