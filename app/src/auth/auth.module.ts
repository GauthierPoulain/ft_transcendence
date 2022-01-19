import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios"

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

import { UsersModule } from "../users/users.module";

@Module({
  imports: [HttpModule, UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
