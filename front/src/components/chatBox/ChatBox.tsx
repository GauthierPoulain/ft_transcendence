import Channels from "./Channels";
import { Outlet } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import "./chatbox.css"

export default function ChatBox() {
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
	);
}
