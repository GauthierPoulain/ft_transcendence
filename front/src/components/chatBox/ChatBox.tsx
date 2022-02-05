import "./chat.css";
import Channels from "./Channels";
import { Outlet } from "react-router-dom";

export default function ChatBox() {
	return (
		<div className="chatContainer">
			<Channels />

			<Outlet />
		</div>
	);
}
