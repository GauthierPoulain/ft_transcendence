import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
} from "typeorm"

import { Membership } from "src/channels/entities/membership.entity"
import { Message } from "src/channels/entities/message.entity"
import { Exclude, Expose } from "class-transformer"

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
    @Exclude()
    joinable: boolean

    // Channel hashed password, used to join public channels.
    @Column()
    @Exclude()
    password: string

    @OneToMany(() => Membership, (membership) => membership.channel, { cascade: true })
    @Exclude()
    memberships: Membership[]

    @OneToMany(() => Message, (message) => message.channel, { cascade: true })
    @Exclude()
    messages: Message[]

    @Expose()
    get type(): "public" | "private" | "protected" {
        if (!this.joinable) {
            return "private"
        }

        if (!this.password) {
            return "public"
        }

        return "protected"
    }
}
