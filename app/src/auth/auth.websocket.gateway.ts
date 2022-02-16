import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import WebSocket from "ws";
import { AuthSocketService } from "./auth-socket.service";

@WebSocketGateway()
export class AuthWebsocketGateway implements OnGatewayDisconnect {
    constructor(private auth: AuthSocketService) {
    }

    handleDisconnect(client: WebSocket) {
        this.auth.logout(client)
    }

    @SubscribeMessage("login")
    async onLogin(@MessageBody() token: string, @ConnectedSocket() client: WebSocket) {
        console.log("logging in someone")
        await this.auth.login(client, token)        
    }

    @SubscribeMessage("logout")
    onLogout(@ConnectedSocket() client: WebSocket) {
        this.auth.logout(client)        
    }
}
