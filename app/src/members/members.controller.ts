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
import { ChannelsService } from "src/channels/channels.service"
import { Member } from "./member.entity"

@Controller("members")
export class MembersController {
    constructor(private members: MembersService, private channels: ChannelsService) {
    }

    @Post()
    @UseGuards(ConnectedGuard)
    async create(@CurrentUser() user: User, @Body() body: CreateMemberDto) {
        const channel = await this.channels.findOne(body.channelId)

        if (!channel) {
            throw new NotFoundException
        }

        return this.members.join(channel, user, body.password)
    }

    @Delete(":memberId")
    @UseGuards(ConnectedGuard)
    async remove(@CurrentUserId() userId: number, @Param("memberId") memberId: number) {
        const target = await this.members.findOne(memberId)

        if (!target) {
            throw new NotFoundException
        }

        const current = await this.members.findOneWithChannelAndUser(target.channelId, userId)

        if (!current || current.channelId !== target.channelId) {
            throw new NotFoundException
        }

        // If the user is kicking someone which is an admin or without admin rights
        if (target.id !== current.id && (target.isAdmin || !current.isAdmin)) {
            throw new UnauthorizedException
        }

        await this.members.remove(target)
    }

    // Find only the memberships for the current user.
    @Get()
    @UseGuards(ConnectedGuard)
    find(@CurrentUserId() userId: number): Promise<Member[]> {
        return this.members.findByUser(userId)
    }
}
