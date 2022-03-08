import { Container } from "react-bootstrap"
import UsernameSection from "./UsernameSection"
import AvatarSection from "./AvatarSection"
import TwofactorSection from "./TwofactorSection"

export default function ProfileSettings() {
    return (
        <Container>
            <h2>Settings</h2>

            <UsernameSection />
            <AvatarSection />
            <TwofactorSection />
        </Container>
    )
}
