import { Module } from "@nestjs/common"
import { HttpModule } from "@nestjs/axios"

import { AuthController } from "./auth.controller"

import { UsersModule } from "../users/users.module"
import { AuthService } from "./auth.service"
import { FortyTwoService } from "./fortytwo.service"
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy, AnonymousStrategy } from "./auth.strategy"
import { AuthSocketService } from "./auth-socket.service"
import { ConfigModule, ConfigService } from "@nestjs/config"

@Module({
    imports: [
        HttpModule,
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (service: ConfigService) => ({
                secret: Buffer.from(
                    service.get<string>("JWT_SECRET"),
                    "base64"
                ),
            }),
        }),
    ],
    providers: [
        AuthService,
        AuthSocketService,
        FortyTwoService,
        JwtStrategy,
        AnonymousStrategy,
    ],
    controllers: [AuthController],
    exports: [AuthSocketService],
})
export class AuthModule {}
