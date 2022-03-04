import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, RelationId, OneToOne, JoinColumn } from "typeorm"

import { Message } from "src/channels/messages/message.entity"
import { Exclude, Expose } from "class-transformer"
import { Member } from "src/members/member.entity"
import { User } from "src/users/entities/user.entity"

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: false })
    @Exclude()
    direct: boolean

    // TODO: Apply name validation, for example only ascii character and a minimum/maxximum length
    @Column()
    name: string

    // Is this channel joinable or is it through invitation only.
    // (joinable is the same as public but public is a keyword :upside_down:)
    @Column()
    @Exclude()
    joinable: boolean

    // Channel hashed password, used to join public channels.
    @Column()
    @Exclude()
    password: string

    @OneToMany(() => Member, (member) => member.channel, { cascade: true })
    @Exclude()
    members: Member[]

    @OneToMany(() => Message, (message) => message.channel, { cascade: true })
    @Exclude()
    messages: Message[]

    @Expose()
    get type(): "public" | "private" | "protected" | "direct" {
        if (this.direct) return "direct"
        if (!this.joinable) return "private"
        if (this.password) return "protected"
        return "public"
    }
}

@Entity()
export class DirectChannel {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user._directchannel_userone, { onDelete: "CASCADE" })
    userOne: User

    @RelationId((direct: DirectChannel) => direct.userOne)
    userOneId: number

    @ManyToOne(() => User, (user) => user._directchannel_usertwo, { onDelete: "CASCADE" })
    userTwo: User

    @RelationId((direct: DirectChannel) => direct.userTwo)
    userTwoId: number

    @JoinColumn()
    @OneToOne(() => Channel, { onDelete: "CASCADE" })
    channel: Channel

    @RelationId((direct: DirectChannel) => direct.channel)
    channelId: number
}
