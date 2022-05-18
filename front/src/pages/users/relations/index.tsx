import { Brightness1 } from "@mui/icons-material"
import { Container } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { useUser } from "../../../data/users"
import { useRelations } from "../../../data/relations"
import { useStatus } from "../../../data/status"
import { statusText } from "../../../data/status"
import { statusColor } from "../../../data/status"
import UserAvatar from "../../../components/user/UserAvatar"

import "./index.scss"
import { useAuth } from "../../../data/use-auth"
import { ErrorBox } from "../../../components/error/ErrorBox"
import { HttpError } from "../../../errors/HttpError"

function User({ userId }) {
    const user = useUser(userId)!
    const status = useStatus(user.id)

    return (
        <div className="d-flex relation-card border border-dark border-2 p-2">
            <UserAvatar userId={user.id} className="w-16 h-16" />
            <Link
                to={`/users/${user.id}`}
                className="m-auto mx-3 fs-4 text-decoration-none"
            >
                {user.nickname}
            </Link>
            <div className="m-auto d-flex">
                {statusText(status)}
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
            {relations.map(({ targetId }) => (
                <User key={targetId} userId={targetId} />
            ))}
        </div>
    )
}

export default function Relations() {
    const params = useParams()
    const auth = useAuth()
    const userId = parseInt(params.userId as string, 10)
    const user = useUser(userId)!
    const { friends, blocked } = useRelations()

    if (!auth.connected || auth.userId !== user.id) {
        return <ErrorBox error={new HttpError(401)} />
    }

    return (
        <Container>
            <h2>Friends</h2>
            {friends.length === 0 ? (
                <p className="mb-0">You don't have any friend.</p>
            ) : (
                <Users relations={friends} />
            )}

            <h2 className="mt-3">Blocked users</h2>
            {blocked.length === 0 ? (
                <p className="mb-0">You didn't block anyone.</p>
            ) : (
                <Users relations={blocked} />
            )}
        </Container>
    )
}
