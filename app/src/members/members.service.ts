import {
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { InjectRepository } from "@nestjs/typeorm"
import { verify } from "argon2"
import { instanceToPlain } from "class-transformer"
import { ChannelsService } from "src/channels/channels.service"
import { Channel } from "src/channels/entities/channel.entity"
import { SocketsService } from "src/sockets/sockets.service"
import { AchievementsService } from "src/users/achievements.service"
import { User } from "src/users/entities/user.entity"
import { FindManyOptions, FindOneOptions, Repository } from "typeorm"
import { Member, Role } from "./member.entity"

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Member) private readonly members: Repository<Member>,

        private sockets: SocketsService,

        @Inject(forwardRef(() => ChannelsService))
        private channels: ChannelsService,

        private achievements: AchievementsService
    ) {}

    async create(channel: Channel, user: User, role: Role): Promise<Member> {
        let member = new Member()
        member.channel = channel
        member.user = user
        member.role = role
        member = await this.members.save(member)

        this.sockets
            .findSockets(`users.${member.userId}`)
            .forEach((socket) =>
                this.sockets.join(socket, `channels.${member.channelId}`)
            )
        this.publish("created", instanceToPlain(member, {}))

        return member
    }

    findByUser(userId: User["id"]): Promise<Member[]> {
        return this.members.find({
            where: {
                user: { id: userId },
            },
        })
    }

    findByChannel(channelId: Channel["id"]): Promise<Member[]> {
        return this.members.find({
            where: {
                channel: { id: channelId },
            },
        })
    }

    findOne(memberId: Member["id"]): Promise<Member> {
        return this.members.findOne(memberId)
    }

    findOneReal(options: FindOneOptions<Member>): Promise<Member | undefined> {
        return this.members.findOne(options)
    }

    findOneWithChannelAndUser(
        channelId: Channel["id"],
        userId: User["id"]
    ): Promise<Member> {
        return this.members.findOne({
            where: {
                user: { id: userId },
                channel: { id: channelId },
            },
        })
    }

    find(options: FindManyOptions<Member>): Promise<Member[]> {
        return this.members.find(options)
    }

    setRole(member: Member, role: Role): Promise<Member> {
        member.role = role
        return this.members.save(member)
    }

    async update(member: Member): Promise<Member> {
        member = await this.members.save(member)

        this.publish("updated", instanceToPlain(member, {}))

        return member
    }

    async remove(member: Member): Promise<void> {
        const id = member.id
        await this.members.remove(member)

        this.sockets
            .findSockets(`users.${member.userId}`)
            .forEach((socket) =>
                this.sockets.leave(socket, `channels.${member.channelId}`)
            )
        this.publish("removed", {
            id,
            channelId: member.channelId,
            userId: member.userId,
        })

        if ((await this.findByChannel(member.channelId)).length === 0) {
            this.channels.remove(member.channelId)
        }
    }

    // Logic to run when an user wants to join a channel
    async join(
        channel: Channel,
        user: User,
        password: string
    ): Promise<Member> {
        // An user can't join a private channel
        if (channel.type === "private" || channel.type === "direct") {
            throw new UnauthorizedException()
        }

        // An user can't join a protected channel with an incorrect password
        if (
            channel.type === "protected" &&
            !(await verify(channel.password, password))
        ) {
            throw new UnauthorizedException()
        }

        const member = await this.findOneWithChannelAndUser(channel.id, user.id)

        // If the user is already a member of the channel do not create it
        if (member) {
            return member
        }

        await this.achievements.achieve(user.id, "channel_join")

        return this.create(channel, user, Role.GUEST)
    }

    @OnEvent("socket.auth")
    async onAuthentication({ socket, userId }) {
        const members = await this.findByUser(userId)

        for (const member of members) {
            this.sockets.join(socket, `channels.${member.channelId}`)
        }
    }

    private publish(event: string, data: any) {
        this.sockets.publish(
            [`channels.${data.channelId}`, `users.${data.userId}`],
            `members.${event}`,
            data
        )
    }
}
