import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AuthService } from "../auth/auth.service"
import { Message } from "./entities/message.entity";

@WebSocketGateway()
export class ChannelWebsockGateway implements OnGatewayDisconnect {
	//private static users: Map<WebSocket, number> = new Map();

	//constructor(private auth: AuthService) {
	//}

	handleDisconnect() {
		//ChannelWebsockGateway.users.delete(client)
	}

	@SubscribeMessage("auth")
	async onAuthenticate() {
		console.log("auth message")
		//const { sub } = await this.auth.verify(token) as any

		//ChannelWebsockGateway.users.set(socket, sub)
	}

	async onMessage() {
		console.log("a new message happened")
	}
}
