// import { UseGuards } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server, WebSocket } from "ws"

class user {
    id: string
    constructor(id: string) {
        this.id = id
    }
}

// https://docs.nestjs.com/websockets/guards
@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server

    @SubscribeMessage("game:join")
    game_join(client: any, data: any) {
        console.log("join")
    }

    @SubscribeMessage("game:playermove")
    game_playermove(client: WebSocket, data: any) {
        this.server.clients.forEach((element) => {
            if (!element) return
            let current: WebSocket = element
            // if (current != client)
            current.send(
                JSON.stringify({
                    event: "game:opponentmove",
                    data: data,
                })
            )
        })
    }

    public handleConnection(client: WebSocket): void {
        console.info("[webSocket] client connected")
    }

    public handleDisconnect(client: WebSocket): void {
        console.info("[webSocket] client disconnected")
    }
}
