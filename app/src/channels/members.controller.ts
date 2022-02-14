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
import { JoinChannelDto } from "./channels.dto"
import { ChannelsService } from "./channels.service"
import { verify } from "argon2"

@Controller("channels/:channelId/members")
export class MembersController {
    constructor(private channels: ChannelsService) {}

    @Get()
    @UseGuards(ConnectedGuard)
    async findAll(
        @CurrentUser() user: User,
        @Param("channelId") channelId: number
    ) {
        const channel = await this.channels.findOne(channelId, ["memberships"])

        if (!channel || !channel.memberships.some(({ userId }) => userId === user.id)) {
            throw new UnauthorizedException()
        }

        return channel.memberships
    }

    @Post()
    @UseGuards(ConnectedGuard)
    async join(
        @CurrentUser() user: User,
        @Param("channelId") channelId: number,
        @Body() body: JoinChannelDto
    ) {
        const channel = await this.channels.findOne(channelId, ["memberships"])

        if (!channel) {
            throw new NotFoundException
        }

        if (channel.type === "private" || (channel.type === "protected" && !(await verify(channel.password, body.password)))) {
            throw new UnauthorizedException
        }

        return this.channels.joinChannel(channel, user)
    }
}
