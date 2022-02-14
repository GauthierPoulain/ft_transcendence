import { Brightness1 } from "@material-ui/icons"
import { Link, Outlet, useParams } from "react-router-dom"
import { Edit } from "@material-ui/icons"
import useUser from "../../data/use-user"
import { useAuth } from "../../data/use-auth"

import "./style.scss"
import { Image } from "react-bootstrap"

function Banner() {
    const { userId } = useParams()

    const user = useUser(parseInt(userId as string, 10))

    return (
        <div className="d-flex justify-content-center align-items-center flex-wrap" style={{ backgroundColor: "#c47e7e" }}>
            <div className="d-flex flex-column justify-content-center align-items-center m-3">
                <Image roundedCircle width={130} src={user.image} />
                <p className="mb-0 text-dark fw-bold fs-5">{user.nickname}</p>
            </div>

            <div className="d-flex flex-grow-1 justify-content-evenly flex-wrap">
                <p className="fs-3 m-2 text-dark">
                    Victories: <span style={{ color: "brown" }}>13</span>
                </p>
                <p className="fs-3 m-2 text-dark">
                    Rank: <span style={{ color: "brown" }}>#4</span>
                </p>
            </div>

            <div className="m-3">
                <p className="text-dark text-uppercase mb-0">
                    Online
                    <Brightness1 className="mx-2" style={{ color: "lime" }} />
                </p>
            </div>
        </div>
    )
}

function ProfileRouter() {
    const auth = useAuth();
    const { userId } = useParams()

    const isCurrentUser = auth.connected && auth.userId === parseInt(userId as string)

    return (
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
    )
}

export default function Users() {
    return (
        <>
            <Banner />
            <ProfileRouter />
            <Outlet />
        </>
    )
}
