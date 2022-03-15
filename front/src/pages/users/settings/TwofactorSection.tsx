import { useEffect, useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useAuth } from "../../../data/use-auth"
import { fetcher, useSubmit } from "../../../data/use-fetch"
import { useUser } from "../../../data/users"
import ReactCodeInput from "react-code-input"

function useMutateTfa() {
    return useSubmit<{ token: string; secret: string } | null, void>((data) =>
        fetcher(
            "/settings/tfa",
            {
                method: data ? "POST" : "DELETE",
                body: data ? JSON.stringify(data) : undefined,
            },
            false
        )
    )
}

function DisableTfa() {
    const { submit, isLoading } = useMutateTfa()

    return (
        <Button
            size="sm"
            variant="danger"
            type="submit"
            disabled={isLoading}
            onClick={() => submit(null)}
        >
            Disable 2FA
        </Button>
    )
}

function EnableTfaForm() {
    const [secret, setSecret] = useState<{ qr: string; secret: string } | null>(
        null
    )
    const [token, setToken] = useState("")
    const { submit, isLoading: isSubmitting } = useMutateTfa()

    useEffect(() => {
        fetcher("/settings/tfa").then((secret) => {
            setSecret(secret)
        })
    }, [])

    if (secret === null) {
        return <p>Loading...</p>
    }

    function submitForm(event: any) {
        event.preventDefault()
        return submit({ token, secret: secret!.secret })
    }

    return (
        <Form onSubmit={submitForm}>
            <img src={secret.qr} className="mb-3" />

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Token associated with this QR Code</Form.Label>
                <br />
                <ReactCodeInput
                    className=""
                    name="2facode"
                    value={token}
                    inputMode="numeric"
                    fields={6}
                    onChange={(event) => setToken(event)}
                />
            </Form.Group>
            <Button
                size="sm"
                variant="primary"
                type="submit"
                disabled={isSubmitting}
            >
                Enable 2FA
            </Button>
        </Form>
    )
}

function EnableTfa() {
    const [state, setState] = useState(0)

    if (state === 0) {
        return (
            <Button size="sm" onClick={() => setState(1)}>
                Enable 2FA
            </Button>
        )
    }

    return <EnableTfaForm />
}

export default function TwofactorSection() {
    const auth = useAuth()
    const user = useUser(auth.userId)!

    return user.tfa ? <DisableTfa /> : <EnableTfa />
}
