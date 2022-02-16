import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    UnauthorizedException,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { ConnectedGuard } from "src/auth/connected.guard"
import { User } from "src/users/entities/user.entity"
import { CurrentUser } from "src/users/user.decorator"
import { CreateMessageDto } from "../channels.dto"
import { ChannelsService } from "../channels.service"

@Controller("channels/:channelId/messages")
@UseInterceptors(ClassSerializerInterceptor)
export class MessagesController {
    constructor(private channels: ChannelsService) {}

    @Get()
    @UseGuards(ConnectedGuard)
    async findAll(
        @CurrentUser() user: User,
        @Param("channelId") channelId: number
    ) {
        const channel = await this.channels.findOne(channelId, [
            "memberships",
            "messages",
            "messages.author",
        ])

        if (!channel || !channel.memberships.some(membership => membership.userId === user.id)) {
            throw new UnauthorizedException()
        }

        return channel.messages
    }

    @Post()
    @UseGuards(ConnectedGuard)
    async create(
        @CurrentUser() user: User,
        @Param("channelId") channelId: number,
        @Body() body: CreateMessageDto
    ) {
        const channel = await this.channels.findOne(channelId, ["memberships"])

        if (!channel || !channel.memberships.some(membership => membership.userId === user.id)) {
            throw new UnauthorizedException()
        }

        return this.channels.createMessage(channel, user, body)
    }
}
