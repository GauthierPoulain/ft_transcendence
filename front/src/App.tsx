import { ErrorBoundary } from "react-error-boundary"
import { StrictMode, Suspense, useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider, useAuth } from "./data/use-auth"
import { useWebSocket, WebsocketProvider } from "./data/use-websocket"
import { ReadyState } from "react-use-websocket"
import { setAccessToken } from "./data/use-fetch"
import Loading from "./components/Loading"

import Router from "./pages/Router"
import { UsersProvider, useUsersLoading } from "./data/users"
import { RelationsProvider } from "./data/relations"
import { StatusProvider } from "./data/status"
import { MatchesProvider } from "./data/matches"

function RootProvider({ children }) {
    return (
        <StrictMode>
            <AuthProvider>
                <WebsocketProvider>
                    <BrowserRouter>{children}</BrowserRouter>
                </WebsocketProvider>
            </AuthProvider>
        </StrictMode>
    )
}

function WebsocketTokenIssuer({ children }) {
    const { token } = useAuth()
    const { sendMessage, readyState } = useWebSocket()

    useEffect(() => {
        console.log("token issuer", readyState, ReadyState, token)

        if (readyState === ReadyState.OPEN) {
            sendMessage("login", token)
        }

        setAccessToken(token)
    }, [token, readyState])

    if (readyState !== ReadyState.OPEN) {
        return <Loading />
    }

    return children
}

function Thisisatest() {
    const loading = useUsersLoading()
    const auth = useAuth()

    if (loading) {
        return <p>Loading lol</p>
    }

    return (
        <RelationsProvider settings={auth.connected}>
            <Router />
        </RelationsProvider>
    )
}

export default function App({ tab }: { tab: any }) {
    return (
        <RootProvider>
            <ErrorBoundary
                fallbackRender={({ error }) => (
                    <p>Error??? {error.toString()}</p>
                )}
            >
                <Suspense fallback={<p>No fallback so loading here :)</p>}>
                    <WebsocketTokenIssuer>
                        <UsersProvider>
                            <StatusProvider>
                                <MatchesProvider>
                                    <Thisisatest />
                                </MatchesProvider>
                            </StatusProvider>
                        </UsersProvider>
                    </WebsocketTokenIssuer>
                </Suspense>
            </ErrorBoundary>
        </RootProvider>
    )
}
