// import { UseGuards } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, WebSocket } from "ws"
import { v4 as uuidv4 } from "uuid"

class Client {
    id: string
    _ws: WebSocket

    constructor(ws: WebSocket) {
        this._ws = ws
        this.id = uuidv4()
    }
}

function emit(ws: WebSocket, event: string, data: any) {
    return ws.send(JSON.stringify({ event: event, data: data }))
}

// https://docs.nestjs.com/websockets/guards
@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server
    _clients: Map<WebSocket, Client>

    constructor() {
        this._clients = new Map<WebSocket, Client>()
    }

    // @SubscribeMessage("game:join")
    // game_join(s: WebSocket, data: any) {
    //     console.log("join")
    // }

    @SubscribeMessage("game:playermove")
    game_playermove(s: WebSocket, data: any) {
        this.server.clients.forEach((element) => {
            if (!element) return
            let current: WebSocket = element
            emit(current, "game:opponentmove", data)
        })
    }

    public handleConnection(s: WebSocket): void {
        this._clients.set(s, new Client(s))
        let client = this._clients.get(s)
        console.info("[webSocket] client connected", client.id)
    }

    public handleDisconnect(s: WebSocket): void {
        let client = this._clients.get(s)
        console.info("[webSocket] client disconnected", client.id)
        this._clients.delete(s)
    }
}
