import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios"

import { AuthController } from "./auth.controller";

import { UsersModule } from "../users/users.module";
import { PassportModule } from "@nestjs/passport";
import { OAuth2Strategy } from "./strategies/oauth.strategy";
import { UserSerializer } from "./serializers/user.serializer";

@Module({
  imports: [HttpModule, UsersModule, PassportModule.register({ session: true })],
  providers: [OAuth2Strategy, UserSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
