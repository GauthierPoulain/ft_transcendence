import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common"
import { ConnectedGuard } from "src/auth/connected.guard"
import { CurrentUserId } from "src/users/user.decorator"
import { UsersService } from "src/users/users.service"
import { Match, State } from "./match.entity"
import { CreateMatchDto } from "./matches.dto"
import { MatchesService } from "./matches.service"

@Controller("matches")
export class MatchesController {
    constructor(private matches: MatchesService, private users: UsersService) {}

    @Post()
    @UseGuards(ConnectedGuard)
    async create(
        @CurrentUserId() playerOneId: number,
        @Body() body: CreateMatchDto
    ): Promise<Match> {
        const playerTwo = await this.users.find(body.opponent)

        if (!playerTwo) {
            throw new BadRequestException("Invalid opponent identifier")
        }

        // Check if another match involving these two player exists and is in a waiting state
        const match = await this.matches.get({
            where: [
                {
                    playerOne: { id: playerOneId },
                    playerTwo: { id: playerTwo.id },
                    state: State.WAITING,
                },
                {
                    playerOne: { id: playerTwo.id },
                    playerTwo: { id: playerOneId },
                    state: State.WAITING,
                },
            ],
        })

        if (match) {
            return match
        } else {
            const match = new Match()

            match.playerOne = { id: playerOneId } as any
            match.playerTwo = playerTwo
            return this.matches.create(match)
        }
    }

    @Get()
    find(): Promise<Match[]> {
        return this.matches.find(undefined)
    }

    @Delete(":id")
    @UseGuards(ConnectedGuard)
    async remove(
        @CurrentUserId() userId: number,
        @Param("id") matchId: number
    ): Promise<void> {
        const match = await this.matches.get({
            where: { id: matchId },
        })

        if (!match) {
            throw new NotFoundException()
        }

        // If the user is not one of the two players involved or the game is not in the first stage.
        if (
            !(match.playerOneId === userId || match.playerTwoId === userId) ||
            match.state !== State.WAITING
        ) {
            throw new UnauthorizedException()
        }

        await this.matches.remove(match)
    }
}
