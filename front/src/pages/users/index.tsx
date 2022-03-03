import { Link, Outlet, useParams } from "react-router-dom"
import useUser from "../../data/use-user"
import { useAuth } from "../../data/use-auth"
import UserAvatar from "../../components/user/UserAvatar"
import { useState } from "react"
import { Brightness1, Edit, PersonAdd, PersonAddDisabled } from "@mui/icons-material"
import { statusColor, statusText, useStatus } from "../../data/status"

function Banner() {
    const { userId } = useParams()
    const user = useUser(parseInt(userId as string, 10))

    const status = useStatus(user.id)

    return (
        <div
            className="d-flex justify-content-center align-items-center flex-wrap"
            style={{ backgroundColor: "#c47e7e" }}
        >
            <div className="d-flex flex-column justify-content-center align-items-center m-3">
                <UserAvatar userId={user.id} className="w-32" />
                <p className="mb-0 text-dark fw-bold fs-5">{user.nickname}</p>
            </div>

            <div className="d-flex flex-grow-1 justify-content-evenly flex-wrap">
                <p className="fs-3 m-2 text-dark">
                    Victories: <span style={{ color: "brown" }}>13</span>
                </p>
                <p className="fs-3 m-2 text-dark">
                    Losses: <span style={{ color: "brown" }}>2</span>
                </p>
                <p className="fs-3 m-2 text-dark">
                    Rank: <span style={{ color: "brown" }}>#4</span>
                </p>
            </div>

            <p className="text-dark text-uppercase mb-0 m-3">
                { statusText(status) }
                <Brightness1 className="mx-2" style={{ color: statusColor(status) }} />
            </p>
        </div>
    )
}

function Navigation() {
    const auth = useAuth()
    const { userId } = useParams()

    const isCurrentUser =
        auth.connected && auth.userId === parseInt(userId as string)

    const [follow, setFollow] = useState(false)

    function Follow() {
        if (follow) {
            return (
                <div
                    className="btn btn-danger btn-lg rounded-0"
                    onClick={() => setFollow(!follow)}
                >
                    <PersonAddDisabled />
                </div>
            )
        }

        return (
            <div
                className="btn btn-success btn-lg rounded-0"
                onClick={() => setFollow(!follow)}
            >
                <PersonAdd />
            </div>
        )
    }

    return (
        <div className="btn-group mb-3">
            <Link
                to="matches"
                className="btn btn-dark btn-lg rounded-0"
                replace
            >
                Matches
            </Link>
            <Link
                to="achievements"
                className="btn btn-dark btn-lg rounded-0"
                replace
            >
                Achievements
            </Link>
            {isCurrentUser && (
                <Link
                    to="friends"
                    className="btn btn-dark btn-lg rounded-0"
                    replace
                >
                    Friends
                </Link>
            )}
            {isCurrentUser && (
                <Link
                    to="settings"
                    className="btn btn-warning btn-lg rounded-0"
                    replace
                >
                    <Edit />
                </Link>
            )}
            {!isCurrentUser && Follow()}
        </div>
    )
}

export default function Users() {
    return (
        <>
            <Banner />
            <Navigation />
            <Outlet />
        </>
    )
}
