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
} from "@nestjs/common"
import { ConnectedGuard } from "src/auth/connected.guard"
import { User } from "src/users/entities/user.entity"
import { CurrentUser } from "src/users/user.decorator"
import { ChannelsService } from "./channels.service"
import { CreateChannelDto } from "./dto/create-channel.dto"
import { UpdateChannelDto } from "./dto/update-channel.dto"
import { Channel } from "./entities/channel.entity"
import { MembersService } from "./members/members.service"

@Controller("channels")
@UseInterceptors(ClassSerializerInterceptor)
export class ChannelsController {
    constructor(private readonly channels: ChannelsService, private readonly members: MembersService) {}

    @Post()
    @UseGuards(ConnectedGuard)
    async create(
        @CurrentUser() user: User,
        @Body() createChannelDto: CreateChannelDto
    ): Promise<Channel> {
        return this.channels.create(createChannelDto, user)
    }

    @Get()
    async findAll() {
        return this.channels.findJoinable()
    }

    @Get("joined")
    @UseGuards(ConnectedGuard)
    async findJoined(@CurrentUser() user: User) {
        const members = await this.members.findByUser(user.id)

        return members.map(({ channelId }) => channelId)
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.channels.findOne(+id)
    }

    @Patch(":id")
    update(
        @Param("id") id: string,
        @Body() updateChannelDto: UpdateChannelDto
    ) {
        return this.channels.update(+id, updateChannelDto)
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.channels.remove(+id)
    }
}
