import { useState } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { fetcherPost, useSubmit } from "../../../../data/use-fetch"

export default function MakeProtectedButton({ channelId }) {
    const [password, setPassword] = useState("")

    const { submit, isLoading } = useSubmit<string, void>((password) => {
        return fetcherPost(`/channels/${channelId}/state/protected`, {
            password,
        })
    })

    async function submitWrapper(event: any) {
        event.preventDefault()

        await submit(password)
    }

    return (
        <Form className="w-auto" onSubmit={submitWrapper}>
            <InputGroup>
                <Form.Control
                    className="bg-white text-dark"
                    placeholder="Enter a password..."
                    type="password"
                    size="sm"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    disabled={password.length === 0 || isLoading}
                >
                    Protect channel
                </Button>
            </InputGroup>
        </Form>
    )
}
