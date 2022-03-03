import { Container } from "react-bootstrap"
import { useRelations, useRelationsLoading } from "../../data/relations"
import { useAuth } from "../../data/use-auth";
import { useUser } from "../../data/users";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import { Brightness1 } from "@mui/icons-material"
import { statusText, useStatus, statusColor } from "../../data/status";
import "./friends.scss"

function Friend({ userId }) {
    const user = useUser(userId)
    const url = "/users/" + user.id
    const status = useStatus(user.id)

    return (
        <div className="d-flex friends-card border border-dark border-2 m-2 ms-0 p-2">
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

function Friends() {
    const auth = useAuth();
    const relations = useRelations();
    const friends = relations.filter(
        ({ currentId, kind }) => currentId === auth.userId && kind === "friend"
    )

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
        <Container>
            <h2>Friends</h2>

            { loading ? <p>Loading...</p> : <Friends /> }
        </Container>
    );
}
