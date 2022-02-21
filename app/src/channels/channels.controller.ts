import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ClassSerializerInterceptor,
    UseInterceptors,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common"
import { ConnectedGuard } from "src/auth/connected.guard"
import { Member } from "src/members/member.entity"
import { MembersService } from "src/members/members.service"
import { User } from "src/users/entities/user.entity"
import { CurrentUser, CurrentUserId } from "src/users/user.decorator"
import { ChannelsService } from "./channels.service"
import { CreateChannelDto } from "./dto/create-channel.dto"
import { UpdateChannelDto } from "./dto/update-channel.dto"
import { Channel } from "./entities/channel.entity"

@Controller("channels")
@UseInterceptors(ClassSerializerInterceptor)
export class ChannelsController {
    constructor(
        private readonly channels: ChannelsService,
        private readonly members: MembersService
    ) {}

    @Post()
    @UseGuards(ConnectedGuard)
    async create(
        @CurrentUser() user: User,
        @Body() createChannelDto: CreateChannelDto
    ): Promise<Channel> {
        return this.channels.create(createChannelDto, user)
    }

    @Get()
    async find() {
        return this.channels.find(undefined)
    }

    @Get("joined")
    @UseGuards(ConnectedGuard)
    async findJoined(@CurrentUser() user: User) {
        const members = await this.members.findByUser(user.id)

        return members.map(({ channelId }) => channelId)
    }

    @Get(":id")
    async findOne(@Param("id") channelId: number): Promise<Channel> {
        const channel = await this.channels.findOne(channelId)

        if (!channel) {
            throw new NotFoundException()
        }

        return channel
    }

    @Get(":id/members")
    @UseGuards(ConnectedGuard)
    async findMembers(
        @CurrentUserId() userId: number,
        @Param("id") channelId: number
    ): Promise<Member[]> {
        const members = await this.members.findByChannel(channelId)

        // Assert that the current user is a member of the channel
        if (!members.some((member) => member.userId === userId)) {
            throw new UnauthorizedException()
        }

        return members
    }
}
