import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useAuth } from "../../../data/use-auth"
import { fetcher, useSubmit } from "../../../data/use-fetch"
import { useUser } from "../../../data/users"

function useMutateName() {
    return useSubmit<string, void>((name) =>
        fetcher(
            `/settings/name`,
            {
                method: "POST",
                body: JSON.stringify({ name }),
            },
            false
        )
    )
}

export default function UsernameSection() {
    const auth = useAuth()
    const user = useUser(auth.userId)!
    const [name, setName] = useState(user.nickname)

    const { submit, isLoading } = useMutateName()

    async function submitForm(event: any) {
        event.preventDefault()
        try {
            await submit(name)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Form className="mb-3" onSubmit={submitForm}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Your custom username</Form.Label>
                <Form.Control
                    type="text"
                    className="border-dark bg-dark"
                    placeholder="Enter custom username"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <Form.Text className="text-muted">
                    Use an empty username to remove it.
                </Form.Text>
            </Form.Group>

            <Button
                size="sm"
                variant="primary"
                type="submit"
                disabled={isLoading}
            >
                {name.length === 0 ? "Remove" : "Change"} custom username
            </Button>
        </Form>
    )
}
