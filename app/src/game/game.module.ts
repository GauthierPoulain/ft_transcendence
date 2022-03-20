import { Module } from "@nestjs/common"
import { AuthModule } from "src/auth/auth.module"
import { GameGateway } from "./game.gateway"
import { GameService } from "./game.service"
import { MatchmakingGateway } from "./matchmaking.gateway"

@Module({
    imports: [AuthModule],
    providers: [GameGateway, MatchmakingGateway, GameService],
})
export class GameModule {}
