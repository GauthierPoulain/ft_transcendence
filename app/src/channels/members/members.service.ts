import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { verify } from "argon2";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Channel } from "../entities/channel.entity";
import { Member, Role } from "./member.entity";

@Injectable()
export class MembersService {
    constructor(@InjectRepository(Member) private readonly members: Repository<Member>) {
    }

    create(channel: Channel, user: User, role: Role): Promise<Member> {
        const member = new Member()

        member.channel = channel
        member.user = user
        member.role = role
        return this.members.save(member)
    }

    findAll(channelId: Channel["id"]): Promise<Member[]> {
        return this.members.find({
            where: {
                channel: { id: channelId }
            }
        })
    }

    findOne(channel: Channel, user: User): Promise<Member> {
        return this.members.findOne({
            where: {
                user: { id: user.id },
                channel: { id: channel.id }
            }
        })
    }

    async remove(member: Member) {
        await this.members.remove(member)
    }

    // Logic to run when an user wants to join a channel
    async join(channel: Channel, user: User, password: string): Promise<Member> {
        // An user can't join a private channel
        if (channel.type === "private") {
            throw new UnauthorizedException
        }

        // An user can't join a protected channel with an incorrect password
        if (channel.type === "protected" && !verify(channel.password, password)) {
            throw new UnauthorizedException
        }

        const member = await this.findOne(channel, user)

        // If the user is already a member of the channel do not create it
        if (member) {
            return member
        }

        return this.create(channel, user, Role.GUEST)
    }
}