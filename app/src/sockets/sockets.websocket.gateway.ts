import { OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { SocketsService } from "./sockets.service";

@WebSocketGateway()
export class SocketsGateway implements OnGatewayDisconnect {
    constructor(private sockets: SocketsService) {
    }

    handleDisconnect(client: any) {
        this.sockets.deleteSocket(client)
    }
}
