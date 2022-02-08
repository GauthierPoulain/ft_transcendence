// import { UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from "@nestjs/websockets";
import { Server } from "ws";

// https://docs.nestjs.com/websockets/guards
@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    async handleConnection() {
        console.log(`client connected`);
        //client.broadcast.emit("dummy", Date.now().toLocaleString());
        // this.server.emit("error", "pouet");
    }
    async handleDisconnect() {
        console.log(`client disconnected`);
    }

    @SubscribeMessage("dummy")
    async dummyEvent(
        @MessageBody() data: number,
    ) {
        console.log(`dummy`);
    }
}
