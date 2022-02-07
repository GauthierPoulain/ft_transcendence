import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AuthService } from "../auth/auth.service"
import { Message } from "./entities/message.entity";

@WebSocketGateway({ namespace: "channel" })
export class ChannelWebsockGateway implements OnGatewayDisconnect {
	private static users: Map<WebSocket, number> = new Map();

	constructor(private auth: AuthService) {
	}

	handleDisconnect(client: WebSocket) {
		ChannelWebsockGateway.users.delete(client)
	}

	@SubscribeMessage("auth")
	async onAuthenticate(socket: WebSocket, token: string) {
		const { sub } = await this.auth.verify(token) as any

		ChannelWebsockGateway.users.set(socket, sub)
	}

	async onMessage(message: Message) {
		console.log("a new message happened")
	}
}
