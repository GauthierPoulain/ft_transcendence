import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UsersModule } from "src/users/users.module"
import { Match } from "./match.entity"
import { MatchesController } from "./matches.controller"
import { MatchesService } from "./matches.service"

@Module({
    imports: [TypeOrmModule.forFeature([Match]), UsersModule],
    providers: [MatchesService],
    controllers: [MatchesController],
    exports: [MatchesService],
})
export class MatchesModule {}
