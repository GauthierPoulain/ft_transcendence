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
    ): Promise<Channel> {
        return this.channels.create(createChannelDto, user)
    }

    @Get()
    @UseGuards(MaybeConnectedGuard)
    async findAll(
        @CurrentUser(["channels"]) user: User,
        @Query() query: QueryChannelsDto
    ) {
        if (query.joined === true) {
            if (user === null) {
                throw new UnauthorizedException()
            }

            return user.channels
        }

        return this.channels.findJoinable()
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
