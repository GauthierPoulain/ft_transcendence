import { Member } from "src/members/member.entity"
import { Message } from "src/channels/messages/message.entity"
import { Match } from "src/matches/match.entity"
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

    @OneToMany(() => Member, (member) => member.user)
    memberships: Member[]

    @OneToMany(() => Message, (message) => message.author)
    messages: Message[]

    @OneToMany(() => Match, (match) => match.playerOne)
    matchesPlayerOne: Match[]

    @OneToMany(() => Match, (match) => match.playerTwo)
    matchesPlayerTwo: Match[]
}

interface publicUser {
    id: number
    intra_login: string
    nickname: string
    image: string
}

export { User, publicUser }
