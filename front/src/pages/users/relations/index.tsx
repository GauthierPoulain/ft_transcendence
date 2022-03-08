import { Brightness1 } from "@mui/icons-material"
import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useAuth } from "../../../data/use-auth"
import { useUser } from "../../../data/users"
import { useRelations } from "../../../data/relations"
import { useStatus } from "../../../data/status"
import { statusText } from "../../../data/status"
import { statusColor } from "../../../data/status"
import UserAvatar from "../../../components/user/UserAvatar"

import "./index.scss"

function User({ userId }) {
    const user = useUser(userId)
    const status = useStatus(user.id)

    return (
        <div className="d-flex relation-card border border-dark border-2 p-2">
            <UserAvatar userId={user.id} className="w-16 h-16" />
            <Link to={`/users/${user.id}`} className="m-auto mx-3 fs-4 text-decoration-none">
                {user.nickname}
            </Link>
            <div className="m-auto d-flex">
                <span className="text-white text-uppercase m-auto">
                    {statusText(status)}
                </span>
                <Brightness1
                    className="mx-2 mb-1"
                    style={{ color: statusColor(status) }}
                />
            </div>
        </div>
    )
}

function Users({ relations }) {
    return (
        <div className="d-flex">
            { relations.map(({ targetId }) => <User key={targetId} userId={targetId} />) }
        </div>
    );
}

export default function Relations() {
    const auth = useAuth()
    const relations = useRelations()

    const friends = relations.filter(
        ({ currentId, kind }) => currentId === auth.userId && kind === "friend"
    )

    const blocked = relations.filter(
        ({ currentId, kind }) => currentId === auth.userId && kind === "blocked"
    )

    return (
        <Container>
            <h2>Friends</h2>
            { friends.length === 0 ? <p className="mb-0">You don't have any friend.</p> : <Users relations={friends} /> }

            <h2 className="mt-3">Blocked users</h2>
            { blocked.length === 0 ? <p className="mb-0">You didn't block anyone.</p> : <Users relations={blocked} /> }
        </Container>
    )
}
