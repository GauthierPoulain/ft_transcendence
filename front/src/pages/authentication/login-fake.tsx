import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../data/use-auth"

export default function LoginFake({ user }) {
    const auth = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        auth.fakeExchange(user).then((response) => {
            if (response.user.tfa) {
                navigate("/auth", { state: { twofactortoken: response.token } })
            } else {
                auth.login(response)
            }
        })
    })

    return <p>Trying to login with a fake account {user}</p>
}
