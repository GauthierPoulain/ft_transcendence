import Topbar from "../../components/topbar/Topbar"
import "./profile.css"

function Profile() {
    return (
        <div>
            <Topbar />
            <div className="profileContainer">
                <a href="https://42lyon.fr" target="_blank">
                    <img src="/assets/42.jpg" alt="" className="logo"/>
                </a>
                <div className="profileName">
                    <span>42 Profile</span>
                </div>
            </div>
        </div>
    )
}

export default Profile;