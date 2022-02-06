import { User } from "src/users/entities/user.entity"
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm"
import { Message } from "./message.entity"

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

    @ManyToOne(() => User, user => user.owned_channels)
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
