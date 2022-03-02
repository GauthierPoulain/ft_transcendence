import { Container } from "react-bootstrap"
import { useRelations, useRelationsLoading } from "../../data/relations"
import { useAuth } from "../../data/use-auth";
import { useUser } from "../../data/users";

function Friend({ userId }) {
    const user = useUser(userId)

    return <p>{ user.nickname }</p>
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
        <div>
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
