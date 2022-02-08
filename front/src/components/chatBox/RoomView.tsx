import { useState } from "react"
import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import "./roomview.css"

export default function RoomView() {
	const [messages, setMessages] = useState<string[]>([])
	const [buffer, setBuffer] = useState("")

	const onSubmit = (event: any) => {
		setMessages((messages) => [...messages, buffer])
		setBuffer("")
		event.preventDefault();
	}

	return (
		<Container fluid className="chatContainer">
			<Row>
				<Col className="chatView">
					<h2 className="chatTitle">#student's chat</h2>
					<Stack gap={2}>
						{messages.map((msg) => (
						<div>
							<span className="h5">user0: </span>
							<span>{msg}</span>
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

				<Col xs={2} className="memberView">
					<h2 className="memberTitle">Members</h2>

					<Stack>
						<Link className="memberLinks" to="/users/0">
							<img className="imgMember" src="/assets/42.jpg" alt="" />
							user0
						</Link>
						<Link className="memberLinks" to="/users/1">
							<img className="imgMember" src="/assets/42.jpg" alt="" />
							user1
						</Link>
						<Link className="memberLinks" to="/users/2">
							<img className="imgMember" src="/assets/42.jpg" alt="" />
							user2
						</Link>
					</Stack>
				</Col>
			</Row>
		</Container>
	)
}
