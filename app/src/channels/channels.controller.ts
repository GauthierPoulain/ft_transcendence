import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Request,
    UnauthorizedException,
} from "@nestjs/common"
import { ConnectedGuard, MaybeConnectedGuard } from "src/auth/connected.guard"
import { User } from "src/users/entities/user.entity"
import { CurrentUser } from "src/users/user.decorator"
import { QueryChannelsDto } from "./channels.dto"
import { ChannelsService } from "./channels.service"
import { CreateChannelDto } from "./dto/create-channel.dto"
import { UpdateChannelDto } from "./dto/update-channel.dto"
import { Channel } from "./entities/channel.entity"

@Controller("channels")
export class ChannelsController {
    constructor(private readonly channels: ChannelsService) {}

    @Post()
    @UseGuards(ConnectedGuard)
    async create(
        @CurrentUser() user: User,
        @Body() createChannelDto: CreateChannelDto
    ) {
        await this.channels.create(createChannelDto, user)
    }

    @Get()
    async findAll() {
        return this.channels.findJoinable()
    }

    @Get("joined")
    @UseGuards(ConnectedGuard)
    findJoined(@CurrentUser(["memberships"]) user: User) {
        return user.memberships.map(({ channelId }) => channelId)        
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
