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
import { MembersService } from "src/members/members.service"
import { User } from "src/users/entities/user.entity"
import { CurrentUser, CurrentUserId } from "src/users/user.decorator"
import { CreateMessageDto } from "../channels.dto"
import { ChannelsService } from "../channels.service"
import { MessagesService } from "./messages.service"

@Controller("channels/:channelId/messages")
export class MessagesController {
    constructor(
        private messages: MessagesService,
        private channels: ChannelsService,
        private members: MembersService
    ) {}

    @Post()
    @UseGuards(ConnectedGuard)
    async create(
        @CurrentUser() user: User,
        @Param("channelId") channelId: number,
        @Body() body: CreateMessageDto
    ) {
        const channel = await this.channels.findOne(channelId)

        if (!channel) {
            throw new NotFoundException()
        }

        if (!this.messages.canSendMessage(channel, user.id)) {
            throw new UnauthorizedException()
        }

        return this.messages.create(channel, user, body.content)
    }

    @Get()
    @UseGuards(ConnectedGuard)
    async findAll(
        @CurrentUser() user: User,
        @Param("channelId") channelId: number
    ) {
        const channel = await this.channels.findOne(channelId)

        if (!channel) {
            throw new NotFoundException()
        }

        const member = await this.members.findOneWithChannelAndUser(
            channel.id,
            user.id
        )

        if (!member) {
            throw new UnauthorizedException()
        }

        return this.messages.findAll(channel)
    }

    @Delete(":messageId")
    @UseGuards(ConnectedGuard)
    async remove(
        @CurrentUserId() userId: number,
        @Param("channelId") channelId: number,
        @Param("messageId") messageId: number
    ) {
        // TODO: Maybe relation from message or member instead of different fetch.
        const [channel, message, member] = await Promise.all([
            this.channels.findOne(channelId),
            this.messages.findOne(channelId, messageId),
            this.members.findOneWithChannelAndUser(channelId, userId),
        ])

        if (!message || !member) {
            throw new NotFoundException()
        }

        // If the user is deleting someone else message and he's not an admin or is in a direct message channel.
        if (
            message.authorId !== userId &&
            (!member.isAdmin || channel.type === "direct")
        ) {
            throw new UnauthorizedException()
        }

        await this.messages.remove(message)
    }
}
