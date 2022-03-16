import { Module } from "@nestjs/common"
import { AuthModule } from "src/auth/auth.module"
import { GameGateway } from "./game.gateway"
import { MatchmakingGateway } from "./matchmaking.gateway"

@Module({
    imports: [AuthModule],
    providers: [GameGateway, MatchmakingGateway],
})
export class GameModule {}
