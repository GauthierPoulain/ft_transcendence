import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ChannelsService } from "./channels.service"
import { ChannelsController } from "./channels.controller"
import { UsersModule } from "src/users/users.module"
import { MessagesController } from "./messages/messages.controller"

import { Channel } from "src/channels/entities/channel.entity"
import { Message } from "src/channels/messages/message.entity"
import { AuthModule } from "src/auth/auth.module"
import { MessagesService } from "./messages/messages.service"
import { MembersModule } from "src/members/members.module"

@Module({
    imports: [
        TypeOrmModule.forFeature([Channel, Message]),
        UsersModule,
        AuthModule,
        forwardRef(() => MembersModule),
    ],
    controllers: [ChannelsController, MessagesController],
    providers: [ChannelsService, MessagesService],
    exports: [ChannelsService],
})
export class ChannelsModule {}
