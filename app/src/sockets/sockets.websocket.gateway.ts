import { EventEmitter2 } from "@nestjs/event-emitter"
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
} from "@nestjs/websockets"
import { SocketsService } from "./sockets.service"

@WebSocketGateway()
export class SocketsGateway
    implements OnGatewayDisconnect, OnGatewayConnection
{
    constructor(
        private sockets: SocketsService,
        private emitter: EventEmitter2
    ) {}

    handleDisconnect(client: any) {
        this.sockets.deleteSocket(client)
    }

    async handleConnection(socket: any) {
        await this.emitter.emitAsync("socket.connection", { socket })
    }
}
