import "./chat.css";
import Channels from "./Channels";
import RoomView from "./RoomView";

export default function ChatBox() {
	return (
		<div className="chatContainer">
			<div className="chatleft">
				<div className="channels">
					<Channels />
				</div>
			</div>

			<RoomView />
		</div>
	);
}
