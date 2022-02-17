import {
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
import { User } from "src/users/entities/user.entity"
import { CurrentUser, CurrentUserId } from "src/users/user.decorator"
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
        if (!await this.members.findOneWithChannelAndUser(channelId, user.id)) {
            throw new UnauthorizedException
        }

        return this.members.findByChannel(channelId)
    }

    @Delete(":memberId")
    @UseGuards(ConnectedGuard)
    async remove(@CurrentUserId() userId: number, @Param("channelId") channelId: number, @Param("memberId") memberId: number) {
        const [current, target] = await Promise.all([
            this.members.findOneWithChannelAndUser(channelId, userId),
            this.members.findOne(memberId)
        ])

        if (!current || !target || current.channelId !== target.channelId) {
            throw new NotFoundException
        }

        // If the user is kicking someone which is an admin or without admin rights
        if (target.id !== current.id && (target.isAdmin || !current.isAdmin)) {
            throw new UnauthorizedException
        }

        await this.members.remove(target)
    }
}
