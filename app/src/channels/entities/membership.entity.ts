import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm"

import { User } from "src/users/entities/user.entity"
import { Channel } from "src/channels/entities/channel.entity"

export enum MembershipRole {
    GUEST = "guest",
    ADMIN = "admin",
    OWNER = "owner"
}

@Entity()
export class Membership {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Channel, (channel) => channel.memberships)
    channel: Channel

    @RelationId((membership: Membership) => membership.channel)
    channelId: number

    @ManyToOne(() => User, (user) => user.memberships)
    user: User

    @RelationId((membership: Membership) => membership.user)
    userId: number

    @Column({
        type: "enum",
        enum: MembershipRole,
        default: MembershipRole.GUEST
    })
    role: MembershipRole
}

