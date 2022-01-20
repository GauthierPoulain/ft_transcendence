import { User } from "src/users/entities/user.entity"
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from "typeorm"
import { Message } from "./message.entity"

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number

    // Is this channel joinable or is it through invitation only.
    // (joinable is the same as public but public is a keyword :upside_down:)
    @Column()
    joinable: boolean

    // Channel hashed password, used to join public channels.
    @Column()
    password: string

    @OneToOne(() => User)
    @JoinColumn()
    owner: User

    @ManyToMany(() => User, user => user.admin_channels)
    @JoinTable()
    admins: User[]

    @ManyToMany(() => User, user => user.channels)
    @JoinTable()
    members: User[]

    @OneToMany(() => Message, message => message.channel, { cascade: true })
    messages: Message[]
}
