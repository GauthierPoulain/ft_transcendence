import { Link, Outlet, useParams } from "react-router-dom"
import useUser from "../../data/use-user"
import { useAuth } from "../../data/use-auth"
import UserAvatar from "../../components/user/UserAvatar"
import {
    Brightness1,
    Edit,
    PersonAdd,
    PersonAddDisabled,
    RemoveCircle,
    RemoveCircleOutline,
} from "@mui/icons-material"
import { statusColor, statusText, useStatus } from "../../data/status"
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useRelation } from "../../data/relations"

function BlockButton({ userId }) {
    const { isBlocking, block, unblock } = useRelation(userId)
    const { submit, isLoading } = isBlocking ? unblock : block

    return (
        <OverlayTrigger placement="top" overlay={<Tooltip>{ isBlocking ? "Unblock" : "Block" }</Tooltip>}>
            <Button variant={isBlocking ? "secondary" : "dark"} size="sm" onClick={submit} disabled={isLoading}>
                { isBlocking ? <RemoveCircleOutline /> : <RemoveCircle /> }
            </Button>
        </OverlayTrigger>
    )
}

function FriendButton({ userId }) {
    const { isFriendWith, friend, unfriend } = useRelation(userId)
    const { submit, isLoading } = isFriendWith ? unfriend : friend

    return (
        <OverlayTrigger placement="top" overlay={<Tooltip>{ isFriendWith ? "Remove friend" : "Add friend" }</Tooltip>}>
            <Button variant={isFriendWith ? "danger" : "success"} size="sm" onClick={submit} disabled={isLoading}>
                { isFriendWith ? <PersonAddDisabled /> : <PersonAdd /> }
            </Button>
        </OverlayTrigger>
    )
}

function Banner() {
    const { userId } = useParams()
    const user = useUser(parseInt(userId as string, 10))
    const auth = useAuth()

    const status = useStatus(user.id)
    const isCurrentUser =
        auth.connected && auth.userId === parseInt(userId as string)

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
            {!isCurrentUser && <FriendButton userId={user.id} />}
            {!isCurrentUser && <BlockButton userId={user.id} />}
            <p className="text-dark text-uppercase m-3 my-1">
                {statusText(status)}
                <Brightness1
                    className="mx-2 mb-1"
                    style={{ color: statusColor(status) }}
                />
            </p>
        </div>
    )
}

function Navigation() {
    const auth = useAuth()
    const { userId } = useParams()

    const isCurrentUser =
        auth.connected && auth.userId === parseInt(userId as string)

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
                <>
                    <Link
                        to="relations"
                        className="btn btn-dark btn-lg rounded-0"
                        replace
                    >
                        Relations
                    </Link>
                    <Link
                        to="settings"
                        className="btn btn-warning btn-lg rounded-0"
                        replace
                    >
                        <Edit />
                    </Link>
                </>
            )}
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
