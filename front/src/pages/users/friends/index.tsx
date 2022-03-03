import { Brightness1 } from "@mui/icons-material"
import { Image, Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import "./friends.scss"
import { useAuth } from "../../../data/use-auth"
import { useUser } from "../../../data/users"
import { useRelations } from "../../../data/relations"
import { useStatus } from "../../../data/status"
import { statusText } from "../../../data/status"
import { statusColor } from "../../../data/status"

function Friend({ userId }) {
    const user = useUser(userId)
    const url = "/users/" + user.id
    const status = useStatus(user.id)

    return (
        <div className="d-flex friends-card border border-dark border-2 m-2 p-2">
            <Image className="img" src={user.image} style={{ height: "4em", width: "4em" }} />
            <Link to={url} className="m-auto mx-3 fs-4 text-decoration-none">
                {user.nickname}
            </Link>
            <div className="m-auto d-flex">
                <span className="text-white text-uppercase m-auto">
                    {statusText(status)}
                </span>
                <Brightness1 className="mx-2 mb-1" style={{ color: statusColor(status) }} />
            </div>
        </div>
    )
}

export default function Friends() {
    const auth = useAuth()
    const relations = useRelations()
    const friends = relations.filter(
        ({ currentId, kind }) => currentId === auth.userId && kind === "friend"
    )

    if (friends.length === 0) {
        return <p>You don't have any friend!</p>
    }

    return (
        <div className="d-flex container">
            {friends.map(({ targetId }) => (
                <Friend key={targetId} userId={targetId} />
            ))}
        </div>
    )
}
