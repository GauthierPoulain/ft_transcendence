import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from "typeorm"

import { User } from "src/users/entities/user.entity"
import { Channel } from "src/channels/entities/channel.entity"
import { Exclude } from "class-transformer"

export enum Role {
    GUEST = "guest",
    ADMIN = "admin",
    OWNER = "owner",
}

export function roleRank(role: Role): number {
    const roles = {
        [Role.GUEST]: 0,
        [Role.ADMIN]: 1,
        [Role.OWNER]: 2,
    }

    return roles[role]
}

@Entity()
export class Member {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Channel, (channel) => channel.members, {
        onDelete: "CASCADE",
    })
    channel: Channel

    @RelationId((member: Member) => member.channel)
    channelId: number

    @ManyToOne(() => User, (user: User) => user.memberships, {
        onDelete: "CASCADE",
    })
    user: User

    @RelationId((member: Member) => member.user)
    userId: number

    @Column({
        type: "enum",
        enum: Role,
        default: Role.GUEST,
    })
    role: Role

    @Exclude()
    get isAdmin(): boolean {
        return this.role === Role.ADMIN || this.role === Role.OWNER
    }

    @Column({ default: false })
    muted: boolean
}
