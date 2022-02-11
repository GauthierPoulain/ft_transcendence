// import { UseGuards } from "@nestjs/common";
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets"
import { Server } from "ws"

// https://docs.nestjs.com/websockets/guards
@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer()
    server: Server

    @SubscribeMessage("game_join")
    game_join(client: any, data: any) {
        console.log("join")
    }

    @SubscribeMessage("game_playermove")
    game_playermove(sender: any, data: any) {
        this.server.clients.forEach((client) => {
            if (client != sender)
                client.send(
                    JSON.stringify({ event: "game_opponentmove", data: data })
                )
        })
    }

    @SubscribeMessage("events")
    onEvent(client: any, data: any): any {
        console.log(client)

        return "ok"
    }

    handleConnection() {
        console.log("[socket.io] client connected")
        this.server.emit("dummy", "salut")
    }
    handleDisconnect() {
        console.log("[socket.io] client disconnected")
    }
}
