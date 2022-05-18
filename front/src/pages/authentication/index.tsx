import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../../data/use-auth"
import LoginTfa from "./tfa"

import "./style.scss"

export default function Authentication() {
    const auth = useAuth()
    const location = useLocation()

    if (auth.connected) {
        return (
            <Navigate
                to={auth.created ? `/users/${auth.userId}/settings` : "/"}
                replace
            />
        )
    }

    const state = location.state as { twofactortoken?: string }

    if (state?.twofactortoken) {
        return <LoginTfa token={state.twofactortoken} />
    }

    return <Outlet />
}
