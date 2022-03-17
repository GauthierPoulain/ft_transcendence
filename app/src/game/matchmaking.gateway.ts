import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AuthSocketService } from "src/auth/auth-socket.service";
import { SocketsService } from "src/sockets/sockets.service";
import { WebSocket } from "ws";

@WebSocketGateway()
export class MatchmakingGateway {
    constructor(private auth: AuthSocketService, private sockets: SocketsService) {
    }

    @SubscribeMessage("matchmaking.subscribe")
    subscribe(@ConnectedSocket() socket: WebSocket) {
        // An anonymous socket cannot register for matchmaking.
        if (!this.auth.isConnected(socket)) {
            return
        }

        const sockets = [...this.sockets.findSockets("matchmaking")]

        // Wait for another user if no one is waiting.
        if (sockets.length === 0) {
            this.sockets.join(socket, "matchmaking")
            return
        }

        const [waiting] = sockets;

        // If the user is already waiting on another socet.
        if (this.auth.socketUserId(waiting) === this.auth.socketUserId(socket)) {
            socket.send(JSON.stringify({ event: "matchmaking.error.alreadysubscribed" }))
            return;
        }

        this.sockets.join(socket, "matchmaking")

        // TODO: Game creation
        const game = { id: 1 }

        this.sockets.publish(["matchmaking"], "matchmaking.success", game)
        this.sockets.removeRoom("matchmaking")
    }

    @SubscribeMessage("matchmaking.unsubscribe")
    unsubscribe(@ConnectedSocket() socket: WebSocket) {
        this.sockets.leave(socket, "matchmaking")
    }
}
