import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
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
import { MembersService } from "../members/members.service"
import { MessagesService } from "./messages.service"

@Controller("channels/:channelId/messages")
@UseInterceptors(ClassSerializerInterceptor)
export class MessagesController {
    constructor(private messages: MessagesService, private channels: ChannelsService, private members: MembersService) {
    }

    @Post()
    @UseGuards(ConnectedGuard)
    async create(@CurrentUser() user: User, @Param("channelId") channelId: number, @Body() body: CreateMessageDto) {
        const channel = await this.channels.findOne(channelId)

        if (!channel) {
            throw new NotFoundException()
        }

        const member = await this.members.findOne(channel, user)

        if (!member) {
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

        const member = await this.members.findOne(channel, user)

        if (!member) {
            throw new UnauthorizedException()
        }

        return this.messages.findAll(channel)
    }

}
