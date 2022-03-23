import { useRelations, useRelationsLoading } from "../../data/relations"
import { useUser } from "../../data/users";
import { Link } from "react-router-dom";
import { Brightness1 } from "@mui/icons-material"
import { statusText, useStatus, statusColor } from "../../data/status";
import "./friends.scss"
import UserAvatar from "../../components/user/UserAvatar";

function Friend({ userId }) {
    const user = useUser(userId)
    const status = useStatus(user.id)

    return (
        <div className="d-flex friends-card border border-dark border-2 m-2 ms-0 p-2">
            <UserAvatar userId={user.id} className="w-16 h-16" />
            <Link to={`/users/${user.id}`} className="m-auto mx-3 fs-4 text-decoration-none">
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

function Friends() {
    const { friends } = useRelations();

    if (friends.length === 0) {
        return <p>You don't have any friend!</p>
    }

    return (
        <div className="d-flex mb-3">
            { friends.map(({ targetId }) => <Friend key={targetId} userId={targetId} />) }
        </div>
    )
}

export default function SectionFriends() {
    const loading = useRelationsLoading()

    return (
        <section>
            <h2>Friends</h2>

            { loading ? <p>Loading...</p> : <Friends /> }
        </section>
    );
}
