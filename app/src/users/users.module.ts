import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersService } from "./users.service"
import { UsersController } from "./users.controller"
import { User } from "./entities/user.entity"
import { AchievementsService } from "./achievements.service"

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService, AchievementsService],
    controllers: [UsersController],
    exports: [UsersService, AchievementsService],
})
export class UsersModule {}
