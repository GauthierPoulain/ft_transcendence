import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
} from "typeorm"

import { Membership } from "src/channels/entities/membership.entity"
import { Message } from "src/channels/entities/message.entity"

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number

    // TODO: Apply name validation, for example only ascii character and a minimum/maxximum length
    @Column()
    name: string

    // Is this channel joinable or is it through invitation only.
    // (joinable is the same as public but public is a keyword :upside_down:)
    @Column()
    joinable: boolean

    // Channel hashed password, used to join public channels.
    @Column()
    password: string

    @OneToMany(() => Membership, (membership) => membership.channel, { cascade: true })
    memberships: Membership[]

    @OneToMany(() => Message, (message) => message.channel, { cascade: true })
    messages: Message[]
}
