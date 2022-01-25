import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Server } from "ws";

@WebSocketGateway({})
export class EventsGateway {
    @WebSocketServer()
    server: Server;

    handleConnection() {
        this.server.emit("connection");
    }

    @SubscribeMessage("open")
    async openConnection(@ConnectedSocket() client: Socket): Promise<any> {
        console.log(client.id);
    }

    @SubscribeMessage("dummy")
    async onEvent(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: number,
    ): Promise<any> {
        console.log(client.id);

        console.log(data);

        return data;
    }
}
