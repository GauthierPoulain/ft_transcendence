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
import Game from "./class/Game"

@WebSocketGateway()
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server
    clientArray: WebSocket[]
    gameArray: Game[]
    constructor() {
        this.clientArray = new Array<WebSocket>()
        this.gameArray = new Array<Game>()
    }

    @SubscribeMessage("game.ready")
    open(@ConnectedSocket() s: WebSocket) {
        console.log(`[ws/game] new socket`)
        s.send(JSON.stringify({ event: "salut", data: "pouet" }))
        this.clientArray.push(s)
        // this.clientArray.forEach((socket) => {
        //     socket.send(JSON.stringify({ event: "salut", data: "pouet" }))
        // })

        // console.log(`${this.clientArray.length} socket connected`)
        // if (this.clientArray[0] && this.clientArray[1]) {
        //     const game =
        //         this.gameArray[
        //             this.gameArray.push(
        //                 new Game(this.clientArray[0], this.clientArray[1])
        //             ) - 1
        //         ]
        //     game.start()
        // }
    }

    @SubscribeMessage("game.disconnect")
    disconnect(@ConnectedSocket() s: WebSocket) {
        this.handleDisconnect(s)
    }

    @SubscribeMessage("test")
    test(@MessageBody() data: string, @ConnectedSocket() s: WebSocket) {
        console.log("test", data)
    }

    public handleConnection(@ConnectedSocket() s: WebSocket): void {}

    public handleDisconnect(@ConnectedSocket() s: WebSocket): void {
        // console.log(`[ws/game] socket disconnected`)
        let index = this.clientArray.indexOf(s, 0)
        if (index != -1) {
            this.clientArray.splice(index, 1)
            console.log(`[ws/game] socket disconnected`)
        }
    }
}
