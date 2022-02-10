import Channels from "./Channels";
import { Outlet } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import "./chatbox.css"
import { useAuth } from "../../auth";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Chat()
{
	return (
		<Container fluid>
			<Row>
				<Col xs={2}>
					<Channels />
				</Col>

				<Col>
					<Outlet />
				</Col>
			</Row>
		</Container>
	)
}

export default function ChatBox() {

	const auth = useAuth();

	if (!auth.connected)
	{
		return (
			<div className="notConnected">
                <p>You're not connected</p>
                <Link to="/auth" className="links">
                    <Button>Sign in here !</Button>
                </Link>
            </div>
		)
	}

	return (
		<Chat />
	);
}
