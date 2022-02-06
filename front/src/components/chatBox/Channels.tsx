import { Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./channels.css"

export default function Channels() {
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
							<Link to="/chat/room/0">#channel0</Link>
							<Link to="/chat/room/1">#channel1</Link>
							<Link to="/chat/room/2">#channel2</Link>
						</Stack>
					</Stack>
				</div>
			</div>
		</div>
	)
}
