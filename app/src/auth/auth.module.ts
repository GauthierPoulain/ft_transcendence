import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios"

import { AuthController } from "./auth.controller";

import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { FortyTwoService } from "./fortytwo.service";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy"

@Module({
    imports: [
        HttpModule,
        UsersModule,
        JwtModule.register({
            secret: "TODO: this should be generated with cryptogaphic random later"
        })
    ],
    providers: [AuthService, FortyTwoService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
