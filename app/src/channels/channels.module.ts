import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ChannelsService } from "./channels.service"
import { ChannelsController } from "./channels.controller"
import { UsersModule } from "src/users/users.module"
import { MessagesController } from "./messages.controller"
import { ChannelWebsockGateway } from "./channels.websocket.gateway"
import { MembersController } from "./members.controller"

import { Membership } from "src/channels/entities/membership.entity"
import { Channel } from "src/channels/entities/channel.entity"
import { Message } from "src/channels/entities/message.entity"

@Module({
    imports: [TypeOrmModule.forFeature([Membership, Channel, Message]), UsersModule],
    controllers: [ChannelsController, MessagesController, MembersController],
    providers: [ChannelsService, ChannelWebsockGateway],
})
export class ChannelsModule {}
