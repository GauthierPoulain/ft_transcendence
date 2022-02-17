import { forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { verify } from "argon2";
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
        private channels: ChannelsService
    ) { }

    create(channel: Channel, user: User, role: Role): Promise<Member> {
        const member = new Member()

        member.channel = channel
        member.user = user
        member.role = role
        return this.members.save(member)
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
        await this.members.remove(member)
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

    // Logic to run when an user wants to leave a channel
    // (we may need to transfer ownership or delete the channel)
    async leave(member: Member): Promise<void> {
        // An user leaving which is not an owner means we don't need
        // to delete or transfer ownership.
        if (member.role !== Role.OWNER) {
            return this.remove(member)
        }

        const members = await this.findByChannel(member.channelId)

        // Remove the leaving user from the list of eligible owners.
        const eligible = members.filter(({ id }) => id != member.id)

        // There are other users that can receive the ownership, transfering.
        if (eligible.length !== 0) {
            // Sort eligible members by role then by id.
            const [target] = eligible.sort((first, second) => {
                const cmp = roleRank(first.role) - roleRank(second.role)

                if (cmp !== 0) {
                    return cmp
                } else {
                    return first.id - second.id
                }
            })

            await Promise.all([
                this.remove(member),
                this.setRole(target, Role.OWNER)
            ])
        }

        // No user will be left in the channel, delete the channel directly.
        else {
            return this.channels.remove(member.channelId)
        }
    }
}
