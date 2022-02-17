import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common"
import { ConnectedGuard } from "src/auth/connected.guard"
import { User } from "src/users/entities/user.entity"
import { CurrentUser } from "src/users/user.decorator"
import { MembersService } from "./members.service"
import { CreateMemberDto } from "./members.dto"
import { ChannelsService } from "../channels.service"

@Controller("channels/:channelId/members")
export class MembersController {
    constructor(private channels: ChannelsService, private members: MembersService) {}

    @Post()
    @UseGuards(ConnectedGuard)
    async create(@CurrentUser() user: User, @Param("channelId") channelId: number, @Body() body: CreateMemberDto) {
        const channel = await this.channels.findOne(channelId)

        if (!channel) {
            throw new NotFoundException
        }

        return this.members.join(channel, user, body.password)
    }

    @Get()
    @UseGuards(ConnectedGuard)
    async findAll(
        @CurrentUser() user: User,
        @Param("channelId") channelId: number
    ) {
        // If the user is not a member of the channel.
        if (!await this.members.findOne(channelId, user.id)) {
            throw new UnauthorizedException
        }

        return this.members.findByChannel(channelId)
    }
}
