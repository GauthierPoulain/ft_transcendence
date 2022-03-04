import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    UseInterceptors,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common"
import { ConnectedGuard } from "src/auth/connected.guard"
import { Member } from "src/members/member.entity"
import { MembersService } from "src/members/members.service"
import { User } from "src/users/entities/user.entity"
import { CurrentUser, CurrentUserId } from "src/users/user.decorator"
import { UsersService } from "src/users/users.service"
import { ChannelsService } from "./channels.service"
import { DirectChannelsService } from "./directchannels.service"
import { CreateChannelDto } from "./dto/create-channel.dto"
import { Channel } from "./entities/channel.entity"

@Controller("channels")
export class ChannelsController {
    constructor(
        private readonly channels: ChannelsService,
        private readonly directChannels: DirectChannelsService,
        private readonly members: MembersService,
        private readonly users: UsersService
    ) {}

    @Post()
    @UseGuards(ConnectedGuard)
    async create(
        @CurrentUser() user: User,
        @Body() createChannelDto: CreateChannelDto
    ): Promise<Channel> {
        return this.channels.create(createChannelDto, user)
    }

    // Create a direct message channel
    @Post("users/:id")
    @UseGuards(ConnectedGuard)
    async createDirect(@CurrentUser() user: User, @Param("id") targetId: number): Promise<Channel> {
        const target = await this.users.find(targetId)

        if (!target) {
            throw new NotFoundException();
        }

        return this.directChannels.create(user, target)
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
