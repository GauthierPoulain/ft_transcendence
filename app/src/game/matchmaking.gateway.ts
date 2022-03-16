import { OnEvent } from "@nestjs/event-emitter";
import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { AuthSocketService } from "src/auth/auth-socket.service";
import { WebSocket } from "ws";

// TODO: Maybe use socket service and rooms instead of managing the socket here.
@WebSocketGateway()
export class MatchmakingGateway {
    private waiting: WebSocket | null = null

    constructor(private auth: AuthSocketService) {
    }

    @SubscribeMessage("matchmaking.subscribe")
    subscribe(@ConnectedSocket() socket: WebSocket) {
        // An anonymous socket cannot register for matchmaking.
        if (!this.auth.isConnected(socket)) {
            return
        }

        // Wait for another user if no one is waiting.
        if (this.waiting === null) {
            this.waiting = socket
            return
        }

        // If the user is already waiting on another socet.
        if (this.auth.socketUserId(this.waiting) === this.auth.socketUserId(socket)) {
            socket.send(JSON.stringify({ event: "matchmaking.error.alreadysubscribed" }))
            return;
        }

        // TODO: Game creation
        const game = { id: 1 }
        const message = JSON.stringify({ event: "matchmaking.success", data: game })

        this.waiting.send(message)
        socket.send(message)

        this.waiting = null;
    }

    @SubscribeMessage("matchmaking.unsubscribe")
    unsubscribe(@ConnectedSocket() socket: WebSocket) {
        console.log("unsubscribe")
        if (this.waiting === socket) {
            this.waiting = null;
        }
    }

    @OnEvent("socket.disconnect")
    onDisconnect({ socket }) {
        this.unsubscribe(socket)
    }
}
