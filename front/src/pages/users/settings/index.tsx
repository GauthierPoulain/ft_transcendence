import { Container } from "react-bootstrap"
import UsernameSection from "./UsernameSection"
import AvatarSection from "./AvatarSection"
import TwofactorSection from "./TwofactorSection"

export default function ProfileSettings() {
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
