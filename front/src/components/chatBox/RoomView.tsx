import { useState } from "react"
import { useResource, useController } from "@rest-hooks/core"
import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { ChannelResource } from "../../api/resources/ChannelResource";
import { MessageResource } from "../../api/resources/MessageResource";
import "./roomview.css"

export default function RoomView() {
	const { channelId } = useParams();
	const { fetch } = useController();

	const [channel, messages, members] = useResource(
		[ChannelResource.detail(), { id: channelId }],
		[MessageResource.list(), { channelId }],
		[ChannelResource.members(), { id: channelId }]
	)

	const [buffer, setBuffer] = useState("")

	const onSubmit = (event: any) => {
		event.preventDefault();

		const request = fetch(MessageResource.create(), { channelId }, { content: buffer })
		setBuffer("")

		console.log(request)
	}

	return (
		<Container fluid className="chatContainer">
			<Row>
				<Col className="chatView">
					<h2 className="chatTitle">{channel.name}</h2>
					<Stack gap={2}>
						{messages.map(({ id, content, author }) => (
						<div key={id}>
							<span className="h5">{author?.intra_login}: </span>
							<span>{content}</span>
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
					{
						members.map(({ id, intra_login, intra_image_url }) =>
						<Link className="memberLinks" to={`/users/${id}`} key={id}>
							<img className="imgMember" src={intra_image_url} alt="" />
							{intra_login}
						</Link>
						)
					}
					</Stack>
				</Col>
			</Row>
		</Container>
	)
}
