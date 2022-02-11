import "./profile.scss"
import Profileban from "../../components/profileban/Profileban"
import { Brightness1 } from "@material-ui/icons"
import { Link, Outlet } from "react-router-dom"
import { Edit } from "@material-ui/icons"
import { useAuth } from "../../services/auth"
import { api } from "../../services"

function ProfileConnected() {
    const auth = useAuth()
    const { data: user, isLoading, isError } = api.endpoints.getUser.useQuery(auth.userId)

    if (isError) {
        return <p>An error happened while fetching this profile</p>
    }

    if (isLoading) {
        return <p>Loading...</p>
    }

    const url = `https://profile.intra.42.fr/users/${user.intra_login}`

    return (
        <div>
            <div className="profileContainer">
                <div className="profleft">
                    <a href={url} target="_blank">
                        <img
                            src={user.image}
                            alt=""
                            className="profilePicture"
                        />
                    </a>
                    <div className="profileName">
                        <span>{user.nickname}</span>
                    </div>
                </div>
                <div className="profcenter">
                    <span className="profText">
                        Victories:
                        <span className="profPoint">13</span>
                    </span>
                    <span className="profText">
                        Rank:
                        <span className="profPoint">#4</span>
                    </span>
                </div>
                <div className="profright">
                    <span>ONLINE</span>
                    <Brightness1 className="profConnected" />
                </div>
            </div>
        </div>
    )
}

function Layout() {
    return (
        <div>
            <Profileban>
                <ProfileConnected />
            </Profileban>

            <div className="profNav">
                <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic example"
                >
                    <button type="button" className="btn btn-light btn-lg">
                        <Link to="matches" className="proflinks">
                            Matches
                        </Link>
                    </button>
                    <button type="button" className="btn btn-light btn-lg">
                        <Link to="achievements" className="proflinks">
                            Achievements
                        </Link>
                    </button>
                    <button type="button" className="btn btn-light btn-lg">
                        <Link to="friends" className="proflinks">
                            Friends
                        </Link>
                    </button>

                    <button type="button" className="btn btn-warning btn-lg">
                        <Link to="settings" className="proflinks">
                            <Edit />
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function Profile() {
    return (
        <div>
            <Layout />
            <Outlet />
        </div>
    )
}
