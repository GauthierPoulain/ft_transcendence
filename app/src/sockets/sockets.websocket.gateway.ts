import { EventEmitter2 } from "@nestjs/event-emitter"
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets"
import { AuthSocketService } from "src/auth/auth-socket.service"
import { SocketsService } from "./sockets.service"

@WebSocketGateway()
export class SocketsGateway
    implements OnGatewayDisconnect, OnGatewayConnection
{
    constructor(
        private sockets: SocketsService,
        private auth: AuthSocketService,
        private emitter: EventEmitter2
    ) {}

    async handleDisconnect(socket: any) {
        const userId = this.auth.socketUserId(socket)

        this.auth.logout(socket)
        this.sockets.deleteSocket(socket)
        await this.emitter.emitAsync("socket.disconnect", { socket, userId })
    }

    async handleConnection(socket: any) {
        this.sockets.join(socket, "all")
        await this.emitter.emitAsync("socket.connection", { socket })
    }

    @SubscribeMessage("login")
    async onLogin(
        @MessageBody() token: string,
        @ConnectedSocket() socket: any
    ) {
        if (this.auth.isConnected(socket) && !token) {
            // Acts the same as if the user disconnected then reconnected.
            this.handleDisconnect(socket)
            this.handleConnection(socket)
        } else if (!this.auth.isConnected(socket) && token) {
            const userId = await this.auth.login(socket, token)

            this.sockets.join(socket, `users.${userId}`)
            await this.emitter.emitAsync("socket.auth", {
                socket,
                userId,
            })
        }
    }
}
