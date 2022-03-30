import { Module } from "@nestjs/common"
import { AuthModule } from "src/auth/auth.module"
import { MatchesModule } from "src/matches/matches.module"
import { GameGateway } from "./game.gateway"
import { GameService } from "./game.service"
import { GameWaitingGateway } from "./waiting.gateway"

@Module({
    imports: [AuthModule, MatchesModule],
    providers: [GameGateway, GameWaitingGateway, GameService],
})
export class GameModule {}
