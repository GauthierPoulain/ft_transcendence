import { Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useResource } from "rest-hooks";
import { ChannelResource } from "../../api/resources/ChannelResource"
import "./channels.css"

export default function Channels() {
	const channels = useResource(ChannelResource.joined(), { })

	return (
		<div className="chatleft">
			<div className="channels">
				<div className="container">
					<h2>Channels</h2>

					<Stack gap={3}>
						<Stack>
							<Link to="/chat">Join a channel</Link>
							<Link to="/chat/create">Create a channel</Link>
						</Stack>

						<Stack>
							{ channels.map((channel) => <Link to={`/chat/room/${channel.id}`}>{ channel.name }</Link>) }
						</Stack>
					</Stack>
				</div>
			</div>
		</div>
	)
}
