import { Link } from "react-router-dom"
import { useAuth } from "../../data/use-auth"
import useUser from "../../data/use-user"
import { Container, Image, Nav, Navbar } from "react-bootstrap"

function Profile({ userId }) {
    const user = useUser(userId)

    return <Link className="nav-link" to={`/users/${user.id}`}>
        Profile
        <Image className="ms-2" fluid roundedCircle width={22} height={22} src={user.image} />
    </Link>
}

export default function Topbar() {
    const auth = useAuth();

    return (
        <Navbar bg="light" variant="dark">
            <Container>
                <Navbar.Brand>ft_pong</Navbar.Brand>

                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/">Home</Link>
                        <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
                        <Link className="nav-link" to="/chat">Chat</Link>
                    </Nav>

                    <Nav>
                        { auth.connected && <Profile userId={auth.userId} /> }
                        { !auth.connected && <Link className="nav-link" to="/auth">Sign in</Link> }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
