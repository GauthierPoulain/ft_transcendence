// import { UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Server } from "ws";

// https://docs.nestjs.com/websockets/guards
@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage("game_join")
    game_join(@ConnectedSocket() client: Socket) {
        client.join("game");
        console.log(client.rooms);
    }

    @SubscribeMessage("game_playermove")
    game_playermove(
        @MessageBody() data: { YPos: number },
        @ConnectedSocket() client: Socket,
    ) {
        client.to("game").emit("game_opponentmove", data);
    }

    handleConnection() {
        console.log("[socket.io] client connected");
    }
    handleDisconnect() {
        console.log("[socket.io] client disconnected");
    }
}
