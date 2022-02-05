import { useState } from "react"

export default function RoomView() {
	const [messages, setMessages] = useState<string[]>([])
	const [buffer, setBuffer] = useState("")

	const onSubmit = (event: any) => {
		setMessages((messages) => [...messages, buffer])
		setBuffer("")
		event.preventDefault();
	}

	return (
		<>
			<div className="chatcenter">
				<div className="chat">
					<span className="chatname">#student's chat</span>
					<div className="chatbox">
						{messages.map((msg) => (
							<div>
								<span>{msg}</span> <br />
							</div>
						))}
					</div>
					<form onSubmit={onSubmit}>
						<input
							type="text"
							value={buffer}
							onChange={(event) => setBuffer(event.target.value)}
							placeholder="type something..."
							className="inputHolder"
						/>
					</form>
				</div>
			</div>

			<div className="chatright">
				<div className="friendschat">
					<span className="chattitle">In chat</span>
					<br /><br />
					<ul className="inchatList">
						<li>pouic</li>
						<li>pouet</li>
						<li>flignoti</li>
					</ul>
				</div>
			</div>
		</>
	)
}
