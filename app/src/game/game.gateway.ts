// import { UseGuards } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, WebSocket } from "ws"

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server

    @SubscribeMessage("test")
    test(@MessageBody() data: string, @ConnectedSocket() socket: WebSocket) {
        console.log("test")
        console.log(data)
    }

    public handleConnection(@ConnectedSocket() socket: WebSocket): void {
        // let client = this._clients.set(socket, new Client(socket)).get(socket)
        // client._ws.send(JSON.stringify({ event: "salut", data: "owo" }))
        // client.emit("salut", "pouet")
        // console.info("[webSocket/game][%s] client connected", client.id)
    }

    public handleDisconnect(@ConnectedSocket() socket: WebSocket): void {
        // let client = this._clients.get(socket)
        // this._clients.delete(socket)
        // console.info("[webSocket/game][%s] client disconnected", client.id)
    }
}
