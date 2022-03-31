import { Module } from "@nestjs/common"
import { SocketsModule } from "src/sockets/sockets.module"
import { StatusController } from "./status.controller"
import { StatusService } from "./status.service"

@Module({
    imports: [SocketsModule],
    providers: [StatusService],
    controllers: [StatusController],
})
export class StatusModule {}
