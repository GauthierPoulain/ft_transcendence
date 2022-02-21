import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ChannelsModule } from "src/channels/channels.module"
import { UsersModule } from "src/users/users.module"
import { Member } from "./member.entity"
import { MemberSubscriber } from "./member.subscriber"
import { MembersController } from "./members.controller"
import { MembersService } from "./members.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([Member]),
        UsersModule,
        forwardRef(() => ChannelsModule),
    ],
    providers: [MembersService, MemberSubscriber],
    controllers: [MembersController],
    exports: [MembersService],
})
export class MembersModule {}
