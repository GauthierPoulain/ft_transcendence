import { Channel } from "src/channels/entities/channel.entity"
import { Message } from "src/channels/entities/message.entity"
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    OneToMany,
} from "typeorm"

@Entity()
class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    intra_id: number

    @Column()
    intra_login: string

    @Column()
    intra_image_url: string

    @Column({ default: "" })
    tfa_secret: string

    @Column({ default: "" })
    image_seed: string

    @Column({ default: "" })
    nickname: string

    @OneToMany(() => Channel, (channel) => channel.owner)
    owned_channels: Channel[]

    // Channels where the user is at least an administrator
    @ManyToMany(() => Channel, (channel) => channel.admins)
    admin_channels: Channel[]

    // Channels where the user is at least a member
    @ManyToMany(() => Channel, (channel) => channel.members)
    channels: Channel[]

    @OneToMany(() => Message, (message) => message.author)
    messages: Message[]
}

interface publicUser {
    id: number
    intra_login: string
    nickname: string
    image: string
}

export { User, publicUser }
