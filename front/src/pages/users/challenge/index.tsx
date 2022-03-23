import { Button, Container, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useUser } from "../../../data/users";

function ChallengeForm({ userId }) {
    function submitForm(event: any) {
        event.preventDefault()
    }

    return (
        <Form className="mb-3" onSubmit={submitForm}>
            <p>TODO: Form with game options such as powerups</p>
            <Button
                size="sm"
                variant="primary"
                type="submit"
            >
                Challenge
            </Button>
        </Form>
    )
}

export default function ChallengeUser() {
    const params = useParams()
    const userId = parseInt(params.userId as string, 10)
    const user = useUser(userId)

    return (
        <Container>
            <h2>Challenge</h2>
            <p>Let's challenge { user.nickname } to a pong game!</p>

            <ChallengeForm userId={user.id} />
        </Container>
    )
}
