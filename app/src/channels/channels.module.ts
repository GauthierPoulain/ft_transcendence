import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ChannelsService } from "./channels.service"
import { ChannelsController } from "./channels.controller"
import { UsersModule } from "src/users/users.module"
import { MessagesController } from "./messages/messages.controller"
import { MembersController } from "./members/members.controller"

import { Member } from "src/channels/members/member.entity"
import { Channel } from "src/channels/entities/channel.entity"
import { Message } from "src/channels/messages/message.entity"
import { AuthModule } from "src/auth/auth.module"
import { MessagesService } from "./messages/messages.service"
import { MembersService } from "./members/members.service"
import { MemberSubscriber } from "./members/member.subscriber"

@Module({
    imports: [TypeOrmModule.forFeature([Member, Channel, Message]), UsersModule, AuthModule],
    controllers: [ChannelsController, MessagesController, MembersController],
    providers: [ChannelsService, MessagesService, MembersService, MemberSubscriber],
})
export class ChannelsModule {}
