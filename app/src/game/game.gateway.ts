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
import Lobby from "./class/Lobby"

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server
    clientArray: WebSocket[]
    relationalMap: Map<WebSocket, Lobby>
    gameArray: Lobby[]
    constructor() {
        this.clientArray = new Array<WebSocket>()
        this.gameArray = new Array<Lobby>()
        this.relationalMap = new Map<WebSocket, Lobby>()
    }

    @SubscribeMessage("game:ready")
    open(@ConnectedSocket() s: WebSocket) {
        console.log(`[ws/game] new socket`)
        this.clientArray.push(s)
        if (this.clientArray[0] && this.clientArray[1]) {
            const lobby =
                this.gameArray[
                    this.gameArray.push(
                        new Lobby(this.clientArray[0], this.clientArray[1])
                    ) - 1
                ]
            this.relationalMap.set(this.clientArray[0], lobby)
            this.relationalMap.set(this.clientArray[1], lobby)
            lobby.start()
        }
    }

    @SubscribeMessage("game:disconnect")
    disconnect(@ConnectedSocket() s: WebSocket) {
        this.handleDisconnect(s)
    }

    @SubscribeMessage("test")
    test(@ConnectedSocket() s: WebSocket, @MessageBody() data: any) {
        console.log("test", data)
    }

    @SubscribeMessage("game:playerMove")
    playerMove(@ConnectedSocket() s: WebSocket, @MessageBody() data: any) {
        const lobby = this.relationalMap.get(s)
        if (lobby) {
            if (s == lobby._player_one) lobby.movePlayer("one", data)
            if (s == lobby._player_two) lobby.movePlayer("two", data)
        }
    }

    public handleConnection(@ConnectedSocket() s: WebSocket): void {}

    public handleDisconnect(@ConnectedSocket() s: WebSocket): void {
        let index = this.clientArray.indexOf(s, 0)
        let lobby = this.relationalMap.get(s)
        if (index != -1) {
            if (lobby) {
                lobby.stop()
            }
            this.clientArray.splice(index, 1)
            console.log(`[ws/game] socket disconnected`)
        }
    }
}
