import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Match } from "../../../data/matches";
import { fetcherPost, useSubmit } from "../../../data/use-fetch";
import { useUser } from "../../../data/users";

type MatchCreation = {
    opponent: number
}

function useMutateChallenge() {
    return useSubmit<MatchCreation, Match>((match) => fetcherPost("/matches", match, true))
}

function ChallengeForm({ userId }) {
    const { submit, isLoading } = useMutateChallenge()
    const navigate = useNavigate()

    async function submitForm(event: any) {
        event.preventDefault()

        const match = await submit({ opponent: userId })

        navigate(`/game/${match.id}`, { replace: true })
    }

    return (
        <Form className="mb-3" onSubmit={submitForm}>
            <p>TODO: Form with game options such as powerups</p>
            <Button
                size="sm"
                variant="primary"
                type="submit"
                disabled={isLoading}
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
