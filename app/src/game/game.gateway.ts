// import { UseGuards } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, WebSocket } from "ws"
import Client from "./class/Client"

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server
    _clients: Map<WebSocket, Client>

    constructor() {
        this._clients = new Map<WebSocket, Client>()
    }

    public handleConnection(socket: WebSocket): void {
        let client = this._clients.set(socket, new Client(socket)).get(socket)
        console.info("[webSocket][%s] client connected", client.id)
    }

    public handleDisconnect(socket: WebSocket): void {
        let client = this._clients.get(socket)

        this._clients.delete(socket)
        console.info("[webSocket][%s] client disconnected", client.id)
    }
}
