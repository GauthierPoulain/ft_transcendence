import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios"

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { OAuth2Strategy } from "./strategies/oauth.strategy";

@Module({
  imports: [HttpModule, UsersModule, PassportModule],
  providers: [AuthService, OAuth2Strategy],
  controllers: [AuthController],
})
export class AuthModule {}
