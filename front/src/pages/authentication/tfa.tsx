import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import ReactCodeInput from "react-code-input";
import { ExchangeCodeResponse, useAuth } from "../../data/use-auth";
import { fetcherPost, useSubmit } from "../../data/use-fetch"

export default function LoginTfa({ token }) {
    const auth = useAuth()
    const [tfa, setTfa] = useState("")

    const { submit, isLoading } = useSubmit<
        { token: string; tfa: string },
        ExchangeCodeResponse
    >(({ token, tfa }) =>
        fetcherPost("/auth/upgrade", { token, tfa }, true)
    )

    async function submitForm(event: any) {
        event.preventDefault()
        const response = await submit({ token, tfa })

        auth.login(response)
    }

    return (
        <div className="d-flex align-items-center">
            <div className="container auth-card mt-1 p-3">
                <Form className="code-input" onSubmit={submitForm}>
                    <Form.Group className="mb-3">
                        <Form.Label>Verification code (2fa)</Form.Label>
                        <br />
                        <ReactCodeInput
                            name="2facode"
                            value={tfa}
                            inputMode="numeric"
                            fields={6}
                            onChange={(event) => setTfa(event)}
                        />
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
