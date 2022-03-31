import { Module } from "@nestjs/common"
import { UsersModule } from "../users.module"
import { SettingsController } from "./settings.controller"

@Module({
    imports: [UsersModule],
    controllers: [SettingsController],
})
export class SettingsModule {}
