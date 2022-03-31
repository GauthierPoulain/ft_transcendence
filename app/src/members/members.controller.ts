import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common"
import { ConnectedGuard } from "src/auth/connected.guard"
import { User } from "src/users/entities/user.entity"
import { CurrentUser, CurrentUserId } from "src/users/user.decorator"
import { MembersService } from "./members.service"
import {
    CreateMemberDto,
    UpdateMemberAction,
    UpdateMemberDto,
} from "./members.dto"
import { ChannelsService } from "src/channels/channels.service"
import { Member, Role, roleIsLess } from "./member.entity"

@Controller("members")
export class MembersController {
    constructor(
        private members: MembersService,
        private channels: ChannelsService
    ) {}

    @Post()
    @UseGuards(ConnectedGuard)
    async create(@CurrentUser() user: User, @Body() body: CreateMemberDto) {
        const channel = await this.channels.findOne(body.channelId)

        if (!channel) {
            throw new NotFoundException()
        }

        return this.members.join(channel, user, body.password)
    }

    @Put(":id")
    @UseGuards(ConnectedGuard)
    async update(
        @CurrentUserId() userId: number,
        @Param("id") targetId: number,
        @Body() body: UpdateMemberDto
    ) {
        const target = await this.members.findOne(targetId)

        if (!target) {
            throw new NotFoundException()
        }

        const [channel, current] = await Promise.all([
            this.channels.findOne(target.channelId),
            this.members.findOneWithChannelAndUser(target.channelId, userId),
        ])

        if (!current) {
            throw new NotFoundException()
        }

        // Someone which is not an administrator can't update a member
        if (!current.isAdmin || channel.type === "direct") {
            throw new UnauthorizedException()
        }

        if (body.action === UpdateMemberAction.MUTE) {
            target.muted = true
            await this.members.update(target)
            return
        }

        if (body.action === UpdateMemberAction.UNMUTE) {
            target.muted = false
            await this.members.update(target)
            return
        }

        // These actions are limited to the owner
        if (current.role !== Role.OWNER) {
            throw new UnauthorizedException()
        }

        if (body.action === UpdateMemberAction.PROMOTE) {
            if (target.role === Role.GUEST) {
                target.role = Role.ADMIN
                await this.members.update(target)
            }
            return
        }

        if (body.action === UpdateMemberAction.DEMOTE) {
            if (target.role === Role.ADMIN) {
                target.role = Role.GUEST
                await this.members.update(target)
            }
            return
        }
    }

    @Delete(":memberId")
    @UseGuards(ConnectedGuard)
    async remove(
        @CurrentUserId() userId: number,
        @Param("memberId") memberId: number
    ) {
        const target = await this.members.findOne(memberId)

        if (!target) {
            throw new NotFoundException()
        }

        const [channel, current] = await Promise.all([
            this.channels.findOne(target.channelId),
            this.members.findOneWithChannelAndUser(target.channelId, userId),
        ])

        if (!current || current.channelId !== target.channelId) {
            throw new NotFoundException()
        }

        // If the user is kicking someone with a higher rank
        if (
            (target.id !== current.id &&
                roleIsLess(current.role, target.role)) ||
            channel.type === "direct"
        ) {
            throw new UnauthorizedException()
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
