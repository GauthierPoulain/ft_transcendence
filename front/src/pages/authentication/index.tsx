import { useEffect, useMemo, useState } from "react"
import { Button } from "react-bootstrap"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { ExchangeCodeResponse, useAuth } from "../../data/use-auth"
import "./style.scss"
import { Form } from "react-bootstrap"
import { fetcher, useSubmit } from "../../data/use-fetch"

function TwoFactorAuth({ token }) {
    const auth = useAuth()
    const [tfa, setTfa] = useState("")

    const { submit, isLoading } = useSubmit<{ token: string, tfa: string }, ExchangeCodeResponse>(({ token, tfa }) => fetcher("/auth/upgrade", {
        method: "POST",
        body: JSON.stringify({ token, tfa })
    }))


    async function submitForm(event: any) {
        event.preventDefault()
        const response = await submit({ token, tfa })

        auth.login(response)
    }

    return (
        <div className="d-flex align-items-center">
            <div className="container auth-card mt-5 p-3">
                <h1>Two factor auth</h1>
                <Form className="code-input" onSubmit={submitForm}>
                    <Form.Group className="mb-3">
                        <Form.Label>Verification code</Form.Label>
                        <Form.Control type="text" placeholder="6 digits code" value={tfa} onChange={(event) => setTfa(event.target.value)} />
                    </Form.Group>

                    <Button size="sm" variant="primary" type="submit" disabled={isLoading}>
                        Submit token
                    </Button>
                </Form>
            </div>
        </div>
    )
}

const redirect_uri = new URL("/auth", window.location as any).toString()
const authorize_uri = new URL("https://api.intra.42.fr/oauth/authorize")
authorize_uri.searchParams.set(
    "client_id",
    process.env.REACT_APP_API42UID as string
)
authorize_uri.searchParams.set("redirect_uri", redirect_uri)
authorize_uri.searchParams.set("response_type", "code")

function useQuery() {
    const { search } = useLocation()

    return useMemo(() => new URLSearchParams(search), [search])
}

function RedirectIntra() {
    useEffect(() => {
        window.location = authorize_uri.toString() as any
    })

    return <p>Redirecting to intra...</p>
}

function LoginIntra({ code }: { code: string }) {
    const navigate = useNavigate()
    const auth = useAuth()
    const [state, setState] = useState(0)
    const [token, setToken] = useState("")

    useEffect(() => {
        auth.exchange({ code, redirect_uri })
            .then((response) => {
                if (response.user.tfa) {
                    setToken(response.token)
                    setState(2)
                } else {
                    auth.login(response)
                    navigate("/", { replace: true })
                }
            })
            .catch(() => {
                setState(1)
            })
    }, [auth, code])

    if (state === 1) {
        return <p>An errror during login occured...</p>
    }

    if (state === 2) {
        return <TwoFactorAuth token={token} />
    }

    return <p>Exchanging intra token with our server...</p>
}

function LoginFake({ user }) {
    const auth = useAuth()
    const navigate = useNavigate()
    const [state, setState] = useState(0)
    const [token, setToken] = useState("")

    useEffect(() => {
        console.log("fake login")

        auth.fakeExchange(user)
            .then((response) => {
                if (response.user.tfa) {
                    setToken(response.token)
                    setState(2)
                } else {
                    auth.login(response)
                    navigate("/", { replace: true })
                }
            })
            .catch(() => {
                setState(1)
            })
    }, [auth, user])

    if (state === 1) {
        return <p>An errror during login occured...</p>
    }

    if (state === 2) {
        return <TwoFactorAuth token={token} />
    }

    return <p>Connecting with a the fake account {user} to our server...</p>
}

function LoginButtons({ setState }) {
    return (
        <>
            <Button variant="primary" onClick={() => setState(1)}>
                Sign in
            </Button>

            <Button variant="secondary" onClick={() => setState(2)}>
                Fake login one
            </Button>

            <Button variant="secondary" onClick={() => setState(3)}>
                Fake login two
            </Button>
        </>
    )
}

export function Page() {
    const auth = useAuth()
    const query = useQuery()
    const code = query.get("code")

    const [state, setState] = useState(code ? 4 : 0)

    if (auth.connected) {
        return <Navigate to="/" replace />
    }

    return (
        <div className="m-auto">
            <h1 className="text-center">Authentication</h1>
            <div className="d-flex justify-content-center">
                {state === 0 && <LoginButtons setState={setState} />}
                {state === 1 && <RedirectIntra />}
                {state === 2 && <LoginFake user="one" />}
                {state === 3 && <LoginFake user="two" />}
                {state === 4 && <LoginIntra code={code as string} />}
            </div>
        </div>
    )
}
