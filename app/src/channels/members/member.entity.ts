import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm"

import { User } from "src/users/entities/user.entity"
import { Channel } from "src/channels/entities/channel.entity"

export enum Role {
    GUEST = "guest",
    ADMIN = "admin",
    OWNER = "owner"
}

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Channel, (channel) => channel.members)
    channel: Channel

    @RelationId((member: Member) => member.channel)
    channelId: number

    @ManyToOne(() => User, (user: User) => user.memberships)
    user: User

    @RelationId((member: Member) => member.user)
    userId: number

    @Column({
        type: "enum",
        enum: Role,
        default: Role.GUEST
    })
    role: Role
}

