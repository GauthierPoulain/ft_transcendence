import { Container } from "react-bootstrap"
import UsernameSection from "./UsernameSection"
import AvatarSection from "./AvatarSection"
import TwofactorSection from "./TwofactorSection"
import { useAuth } from "../../../data/use-auth"
import { useParams } from "react-router-dom"
import { useUser } from "../../../data/users"
import { ErrorBox } from "../../../components/error/ErrorBox"
import { HttpError } from "../../../errors/HttpError"

export default function ProfileSettings() {
    const params = useParams()
    const userId = parseInt(params.userId as string, 10)
    const user = useUser(userId)!
    const auth = useAuth()

    if (!auth.connected || auth.userId !== user.id) {
        return <ErrorBox error={new HttpError(401)} />
    }

    return (
        <Container>
            <h2>Settings</h2>

            <h3>Profile</h3>
            <UsernameSection />
            <AvatarSection />

            <h3>Security</h3>
            <TwofactorSection />
        </Container>
    )
}
