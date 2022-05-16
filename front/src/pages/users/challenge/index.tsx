import { useState } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { ErrorBox } from "../../../components/error/ErrorBox"
import { Match } from "../../../data/matches"
import { useAuth } from "../../../data/use-auth"
import { fetcherPost, useSubmit } from "../../../data/use-fetch"
import { useUser } from "../../../data/users"
import { HttpError } from "../../../errors/HttpError"

function ChallengeForm({ userId }) {
    const [powerups, setPowerups] = useState(false)
    const navigate = useNavigate()

    const { submit, isLoading } = useSubmit<{ opponent: number, powerups: boolean }, Match>((match) =>
        fetcherPost("/matches", match, true)
    )

    async function submitForm(event: any) {
        event.preventDefault()

        const match = await submit({ opponent: userId, powerups })

        navigate(`/game/${match.id}`, { replace: true })
    }

    return (
        <Form className="mb-3" onSubmit={submitForm}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Enable powerups" checked={powerups} onChange={(event) => setPowerups(event.target.checked)} />
            </Form.Group>
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
    const user = useUser(userId)!
    const auth = useAuth()

    if (!auth.connected || auth.userId === user.id) {
        return <ErrorBox error={new HttpError(401)} />
    }

    return (
        <Container>
            <h2>Challenge</h2>
            <p>Let's challenge {user.nickname} to a pong game!</p>

            <ChallengeForm userId={user.id} />
        </Container>
    )
}
