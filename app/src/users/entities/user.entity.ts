import { Membership } from "src/channels/entities/membership.entity"
import { Message } from "src/channels/messages/message.entity"
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
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

    @OneToMany(() => Membership, (membership) => membership.user)
    memberships: Membership[]

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
