import { Brightness1 } from "@material-ui/icons"
import { Link, Outlet, useParams } from "react-router-dom"
import { Edit } from "@material-ui/icons"
import useUser from "../../data/use-user"
import { useAuth } from "../../data/use-auth"

import "./style.scss"

function Profileban(props: any) {
    return <div className="container-fluid profileBan">{props.children}</div>
}

function ProfileConnected() {
    const { userId } = useParams()

    const user = useUser(parseInt(userId as string, 10))

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
    const auth = useAuth();
    const { userId } = useParams()

    const isCurrentUser = auth.connected && auth.userId === parseInt(userId as string)

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
                    <Link to="matches" className="btn btn-light btn-lg" replace>
                        Matches
                    </Link>
                    <Link to="achievements" className="btn btn-light btn-lg" replace>
                        Achievements
                    </Link>
                    <Link to="friends" className="btn btn-light btn-lg" replace>
                        Friends
                    </Link>
                    { isCurrentUser && <Link to="settings" className="btn btn-warning btn-lg" replace>
                        <Edit />
                    </Link> }
                </div>
            </div>
        </div>
    )
}

export default function Users() {
    return (
        <div>
            <Layout />
            <Outlet />
        </div>
    )
}
