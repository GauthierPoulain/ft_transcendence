import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../data/use-auth"
import useQuery from "../../utils/use-query"

const redirect_uri = new URL("/auth", window.location as any).toString()
const authorize_uri = new URL("https://api.intra.42.fr/oauth/authorize")
authorize_uri.searchParams.set(
    "client_id",
    process.env.REACT_APP_API42UID as string
)
authorize_uri.searchParams.set("redirect_uri", redirect_uri)
authorize_uri.searchParams.set("response_type", "code")

export default function LoginIntra() {
    const auth = useAuth()
    const navigate = useNavigate()
    const code = useQuery().get("code")

    useEffect(() => {
        if (!code) {
            window.location = authorize_uri.toString() as any
            return
        }

        auth.exchange({ code, redirect_uri }).then((response) => {
            if (response.user.tfa) {
                navigate("/auth", { state: { twofactortoken: response.token } })
            } else {
                auth.login(response)
            }
        })
    }, [auth, code])

    return <p>Trying to login using intra account</p>
}
