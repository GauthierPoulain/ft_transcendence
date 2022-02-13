import { useEffect, useMemo, useState } from "react"
import { Container, Button } from "react-bootstrap"
import { Navigate, useLocation } from "react-router-dom"
import "./style.css"
import { useAuth } from "../../data/use-auth"

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
    const auth = useAuth()
    const [state, setState] = useState(0)

    useEffect(() => {
        auth.login({ code, redirect_uri })
            .then(() => setState(2))
            .catch(() => setState(1))
    }, [])

    if (state == 1) {
        return <p>An errror during login occured...</p>
    }

    if (state == 2) {
        return <Navigate to="/" replace />
    }

    return <p>Exchanging intra token with our server...</p>
}

function LoginFake({ user }) {
    const auth = useAuth()
    const [state, setState] = useState(0)

    useEffect(() => {
        auth.fakeLogin(user)
            .then(() => setState(2))
            .catch(() => setState(1))
    }, [])

    if (state == 1) {
        return <p>An errror during login occured...</p>
    }

    if (state == 2) {
        return <Navigate to="/" replace />
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
    const query = useQuery()
    const code = query.get("code")

    const [state, setState] = useState(code ? 4 : 0)

    return (
        <Container>
            <div className="authContainer">
                <h1>Authentication</h1>

                {state === 0 && <LoginButtons setState={setState} />}
                {state === 1 && <RedirectIntra />}
                {state === 2 && <LoginFake user="one" />}
                {state === 3 && <LoginFake user="two" />}
                {state === 4 && <LoginIntra code={code} />}
            </div>
        </Container>
    )
}
