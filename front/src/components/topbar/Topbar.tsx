import { Link } from "react-router-dom"
import { useAuth } from "../../data/use-auth"
import useUser from "../../data/use-user"
import { Container, Nav, Navbar } from "react-bootstrap"
import UserAvatar from "../user/UserAvatar"
import "./topbar.scss"

function Profile({ userId }) {
    const user = useUser(userId)
    const auth = useAuth()

    return (
        <div className="d-flex">
            <span
                className="m-auto nav-link logout-but"
                onClick={() => auth.logout()}
            >
                Logout
            </span>
            <Link className="nav-link d-flex" to={`/users/${user.id}`}>
                <span className="m-auto">Profile</span>
                <UserAvatar userId={user.id} className="w-8 ms-2" />
            </Link>
        </div>
    )
}

export default function Topbar() {
    const auth = useAuth()

    return (
        <Navbar bg="light" variant="dark" id="navbar">
            <Container>
                <Navbar.Brand>ft_pong</Navbar.Brand>

                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/">
                            Home
                        </Link>
                        <Link className="nav-link" to="/leaderboard">
                            Leaderboard
                        </Link>
                        <Link className="nav-link" to="/chat">
                            Chat
                        </Link>
                    </Nav>

                    <Nav>
                        {auth.connected && <Profile userId={auth.userId} />}
                        {!auth.connected && (
                            <>
                                <Link className="nav-link" to="/auth">
                                    Sign in
                                </Link>
                                { /* Disable these on production */ }
                                <Link className="nav-link" to="/auth/secret/fakeone">
                                    Fake one sign in
                                </Link>
                                <Link className="nav-link" to="/auth/secret/faketwo">
                                    Fake two sign in
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
