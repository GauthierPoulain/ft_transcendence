import { OnEvent } from "@nestjs/event-emitter"
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from "@nestjs/websockets"
import { WebSocket } from "ws"
import { GameService } from "./game.service"

@WebSocketGateway()
export class GameGateway {
    constructor(private game: GameService) {
    }

    @SubscribeMessage("game:disconnect")
    disconnect(@ConnectedSocket() socket: WebSocket) {
        const lobby = this.game.lobbyBySocket(socket)

        if (lobby) {
            // TODO: Lose condition
            this.game.close(lobby)
        }
    }

    @SubscribeMessage("test")
    test(@MessageBody() data: any) {
        console.log("test", data)
    }

    @SubscribeMessage("game:playerMove")
    playerMove(@ConnectedSocket() socket: WebSocket, @MessageBody() data: any) {
        const lobby = this.game.lobbyBySocket(socket)

        if (lobby) {
            if (socket == lobby._player_one) lobby.movePlayer("one", data)
            if (socket == lobby._player_two) lobby.movePlayer("two", data)
        }
    }

    @OnEvent("socket.disconnect")
    onDisconnect({ socket }) {
        this.disconnect(socket)
    }
}
