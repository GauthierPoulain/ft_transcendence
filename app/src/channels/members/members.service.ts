import { forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { verify } from "argon2";
import { instanceToPlain } from "class-transformer";
import { AuthSocketService } from "src/auth/auth-socket.service";
import { SocketsService } from "src/sockets/sockets.service";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { ChannelsService } from "../channels.service";
import { Channel } from "../entities/channel.entity";
import { Member, Role, roleRank } from "./member.entity";

@Injectable()
export class MembersService {
    constructor(
        @InjectRepository(Member) private readonly members: Repository<Member>,

        @Inject(forwardRef(() => ChannelsService))
        private channels: ChannelsService,
        
        private sockets: AuthSocketService,
        private sockets2: SocketsService
    ) { }

    async create(channel: Channel, user: User, role: Role): Promise<Member> {
        let member = new Member()
        member.channel = channel
        member.user = user
        member.role = role
        member = await this.members.save(member)

        const members = await this.findByChannel(member.channelId)
        const users = members.map(({ userId }) => userId)

        // TODO: Find a way to get the class transformer configuration?
        this.sockets.broadcast(users, "channel.member.new", instanceToPlain(member))

        return member
    }

    findByUser(userId: User["id"]): Promise<Member[]> {
        return this.members.find({
            where: {
                user: { id: userId }
            }
        })
    }

    findByChannel(channelId: Channel["id"]): Promise<Member[]> {
        return this.members.find({
            where: {
                channel: { id: channelId }
            }
        })
    }

    findOne(memberId: Member["id"]): Promise<Member> {
        return this.members.findOne(memberId)
    }

    findOneWithChannelAndUser(channelId: Channel["id"], userId: User["id"]): Promise<Member> {
        return this.members.findOne({
            where: {
                user: { id: userId },
                channel: { id: channelId }
            }
        })
    }

    setRole(member: Member, role: Role): Promise<Member> {
        member.role = role
        return this.members.save(member)
    }

    async remove(member: Member): Promise<void> {
        const id = member.id
        await this.members.remove(member)

        const members = await this.findByChannel(member.channelId)
        const users = [...members.map(({ userId }) => userId), member.userId]

        this.sockets.broadcast(users, "channel.member.remove", {
            id,
            channelId: member.channelId,
            userId: member.userId
        })
    }

    // Logic to run when an user wants to join a channel
    async join(channel: Channel, user: User, password: string): Promise<Member> {
        // An user can't join a private channel
        if (channel.type === "private") {
            throw new UnauthorizedException
        }

        // An user can't join a protected channel with an incorrect password
        if (channel.type === "protected" && !await verify(channel.password, password)) {
            throw new UnauthorizedException
        }

        const member = await this.findOneWithChannelAndUser(channel.id, user.id)

        // If the user is already a member of the channel do not create it
        if (member) {
            return member
        }

        return this.create(channel, user, Role.GUEST)
    }

    @OnEvent("socket.auth")
    async onAuthentication({ socket, userId }) {
        const members = await this.findByUser(userId)

        for (const member of members) {
            this.sockets2.join(socket, `channels.${member.channelId}`)
        }
    }
}
