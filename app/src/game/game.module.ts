import { Module } from "@nestjs/common"
import { AuthModule } from "src/auth/auth.module"
import { MatchesModule } from "src/matches/matches.module"
import { StatusModule } from "src/status/status.module"
import { UsersModule } from "src/users/users.module"
import { GameGateway } from "./game.gateway"
import { GameService } from "./game.service"
import { GameWaitingGateway } from "./waiting.gateway"

@Module({
    imports: [AuthModule, MatchesModule, UsersModule, StatusModule],
    providers: [GameGateway, GameWaitingGateway, GameService],
})
export class GameModule {}
