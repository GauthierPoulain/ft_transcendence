import { Global, Module } from "@nestjs/common";
import { SocketsService } from "./sockets.service";
import { SocketsGateway } from "./sockets.websocket.gateway";

@Global()
@Module({
    providers: [
        SocketsService,
        SocketsGateway
    ],
    exports: [
        SocketsService
    ]
})
export class SocketsModule {
}
