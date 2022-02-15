import { Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"

import { AuthController } from "./auth.controller"

import { UsersModule } from "../users/users.module"
import { AuthService } from "./auth.service"
import { FortyTwoService } from "./fortytwo.service"
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy, AnonymousStrategy } from "./auth.strategy"
import { AuthWebsocketGateway } from "./auth.websocket.gateway"
import { AuthSocketService } from "./auth-socket.service"

@Module({
    imports: [
        HttpModule,
        UsersModule,
        JwtModule.register({
            secret: "TODO: this should be generated with cryptogaphic random later",
        }),
    ],
    providers: [AuthService, AuthSocketService, FortyTwoService, JwtStrategy, AnonymousStrategy, AuthWebsocketGateway],
    controllers: [AuthController],
    exports: [AuthSocketService]
})
export class AuthModule {}
