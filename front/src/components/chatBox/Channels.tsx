import { Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useResource, useSubscription } from "rest-hooks";
import { ChannelResource } from "../../api/resources/ChannelResource"
import "./channels.css"

export default function Channels() {
	const channels = useResource(ChannelResource.list(), { joined: true })

	useSubscription(ChannelResource.list(), { joined: true })

	return (
		<div className="chatleft">
			<div className="channels">
				<div className="container chanContainer">
					<h2>Channels</h2>

					<Stack gap={3}>
						<Stack>
							<Link className="chanLinks" to="/chat">Join a channel</Link>
							<Link className="chanLinks" to="/chat/create">Create a channel</Link>
						</Stack>

						<Stack>
							{ channels.map((channel) => <Link className="chans" to={`/chat/room/${channel.id}`}>{ channel.name }</Link>) }
						</Stack>
					</Stack>
				</div>
			</div>
		</div>
	)
}
