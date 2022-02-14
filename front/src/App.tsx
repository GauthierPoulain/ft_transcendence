import { ErrorBoundary } from "react-error-boundary"
import { StrictMode, Suspense } from "react"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./data/use-auth"
import Router from "./components/Router"

function RootProvider({ children }) {
    return (
        <StrictMode>
            <AuthProvider>
                <BrowserRouter>
                    { children }
                </BrowserRouter>
            </AuthProvider>
        </StrictMode>
    )
}

export default function App() {
    return (
        <RootProvider>
            <ErrorBoundary fallbackRender={({error}) => (<p>Error??? {error.toString()}</p>)}>
                <Suspense fallback={<p>No fallback so loading here :)</p>}>
                    <Router />
                </Suspense>
            </ErrorBoundary>
        </RootProvider>
    )
}
