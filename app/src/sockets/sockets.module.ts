import { Global, Module } from "@nestjs/common"
import { AuthModule } from "src/auth/auth.module"
import { SocketsService } from "./sockets.service"
import { SocketsGateway } from "./sockets.websocket.gateway"

@Global()
@Module({
    imports: [AuthModule],
    providers: [SocketsService, SocketsGateway],
    exports: [SocketsService],
})
export class SocketsModule {}
