import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import ReactCodeInput from "react-code-input"
import { ExchangeCodeResponse, useAuth } from "../../data/use-auth"
import { fetcherPost, useSubmit } from "../../data/use-fetch"

export default function LoginTfa({ token }) {
    const auth = useAuth()
    const [tfa, setTfa] = useState("")
    const [error, setError] = useState("")

    const { submit, isLoading } = useSubmit<
        { token: string; tfa: string },
        ExchangeCodeResponse
    >(({ token, tfa }) => fetcherPost("/auth/upgrade", { token, tfa }, true))

    async function submitForm(event: any) {
        event.preventDefault()
        setError("")

        try {
            const response = await submit({ token, tfa })
            auth.login(response)
        } catch {
            setError("You submitted an invalid token")
        }
    }

    return (
        <div className="d-flex align-items-center">
            <div className="container mt-1 p-3">
                <h2>Two factor authentication</h2>
                <Form className="code-input" onSubmit={submitForm}>
                    <Form.Group className="mb-3">
                        <Form.Label>Enter your code</Form.Label>
                        <div>
                            <ReactCodeInput
                                name="2facode"
                                value={tfa}
                                inputMode="numeric"
                                fields={6}
                                onChange={(event) => setTfa(event)}
                            />
                        </div>
                        {error && (
                            <Form.Text className="text-danger">
                                {error}
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Button
                        size="sm"
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                    >
                        Submit token
                    </Button>
                </Form>
            </div>
        </div>
    )
}
