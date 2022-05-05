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
    constructor(private game: GameService) {}

    @SubscribeMessage("game:disconnect")
    disconnect(@ConnectedSocket() socket: WebSocket) {
        const lobby = this.game.lobbyBySocket(socket)

        if (lobby) {
            lobby.disconnect(socket)
            this.game.close(lobby)
        }
    }

    @SubscribeMessage("game:playerMove")
    playerMove(@ConnectedSocket() socket: WebSocket, @MessageBody() data: any) {
        const lobby = this.game.lobbyBySocket(socket)

        if (lobby) {
            if (socket == lobby._player_one) lobby.movePlayer("one", data)
            if (socket == lobby._player_two) lobby.movePlayer("two", data)
        }
    }

    @SubscribeMessage("game:whoAmI")
    whoami(@ConnectedSocket() socket: WebSocket) {
        this.game.lobbyBySocket(socket)?.whoAmI(socket)
    }

    @SubscribeMessage("game:requestPowerup")
    requestPowerup(
        @ConnectedSocket() socket: WebSocket,
        @MessageBody() data: any
    ) {
        const lobby = this.game.lobbyBySocket(socket) || this.game.lobbyBySpec(socket)

        if (lobby) {
            lobby.sendPowerup(socket, data.id)
        }
    }

    @OnEvent("socket.disconnect")
    onDisconnect({ socket }) {
        this.disconnect(socket)
    }

    @SubscribeMessage("socket.game.ready")
    joinedready(
        @ConnectedSocket() socket: WebSocket,
        @MessageBody() body: { gameId: number }
    ) {
        console.log(body)
        const lobby = this.game.lobbyById(body.gameId)

        if (lobby) {
            if (lobby._player_one !== socket && lobby._player_two !== socket)
                lobby.joinSpec(socket)
        }
    }
}
