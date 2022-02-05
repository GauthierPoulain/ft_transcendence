import { useState } from "react"
import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function RoomView() {
	const [messages, setMessages] = useState<string[]>([])
	const [buffer, setBuffer] = useState("")

	const onSubmit = (event: any) => {
		setMessages((messages) => [...messages, buffer])
		setBuffer("")
		event.preventDefault();
	}

	return (
		<Container fluid>
			<Row>
				<Col>
					<h2>#student's chat</h2>
					<Stack gap={2}>
						{messages.map((msg) => (
						<div>
							<p className="h5">user0</p>
							<p>{msg}</p>
						</div>
						))}
					</Stack>
					<form onSubmit={onSubmit}>
						<input
							type="text"
							value={buffer}
							onChange={(event) => setBuffer(event.target.value)}
							placeholder="type something..."
							className="inputHolder"
						/>
					</form>
				</Col>

				<Col xs={2}>
					<h2>Members</h2>

					<Stack>
						<Link to="/users/0">user0</Link>
						<Link to="/users/1">user1</Link>
						<Link to="/users/2">user2</Link>
					</Stack>
				</Col>
			</Row>
		</Container>
	)
}
