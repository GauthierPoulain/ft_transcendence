import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { GameModule } from "./game/game.module"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"

import { User } from "./users/entities/user.entity"
import { ChannelsModule } from "./channels/channels.module"
import { Channel } from "./channels/entities/channel.entity"
import { Message } from "./channels/messages/message.entity"
import { ConfigModule } from "@nestjs/config"
import { SocketsModule } from "./sockets/sockets.module"
import { EventEmitterModule } from "@nestjs/event-emitter"
import { Match } from "./matches/match.entity"
import { MatchesModule } from "./matches/matches.module"
import { MembersModule } from "./members/members.module"
import { Member } from "./members/member.entity"
import { Relation } from "./relations/relation.entity"
import { RelationsModule } from "./relations/relations.module"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        EventEmitterModule.forRoot({
            wildcard: true,
        }),
        TypeOrmModule.forRoot({
            // TODO: Make them configurable.
            type: "postgres",
            host:
                process.env["NODE_ENV"] == "production"
                    ? "db"
                    : "localhost",
            port: 5432,
            username: "postgres",
            password: "postgres",
            database: "ft_transcendance",

            // TODO: This can destroy production data, so we may want to remove this in the future.
            synchronize: true,

            entities: [User, Channel, Message, Member, Match, Relation],
        }),
        GameModule,
        UsersModule,
        AuthModule,
        ChannelsModule,
        SocketsModule,
        MatchesModule,
        MembersModule,
        RelationsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
