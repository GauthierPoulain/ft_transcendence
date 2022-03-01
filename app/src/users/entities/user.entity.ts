import { Member } from "src/members/member.entity"
import { Message } from "src/channels/messages/message.entity"
import { Match } from "src/matches/match.entity"
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm"
import { Exclude } from "class-transformer"
import { Relation } from "src/relations/relation.entity"

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

    @Exclude()
    @OneToMany(() => Member, (member) => member.user)
    memberships: Member[]

    @Exclude()
    @OneToMany(() => Message, (message) => message.author)
    messages: Message[]

    @Exclude()
    @OneToMany(() => Match, (match) => match.playerOne)
    matchesPlayerOne: Match[]

    @Exclude()
    @OneToMany(() => Match, (match) => match.playerTwo)
    matchesPlayerTwo: Match[]

    @Exclude()
    @ManyToOne(() => Relation, (relation) => relation.current)
    _relations_current: Relation[]

    @Exclude()
    @ManyToOne(() => Relation, (relation) => relation.target)
    _relations_target: Relation[]
}

interface publicUser {
    id: number
    intra_login: string
    nickname: string
    image: string
}

export { User, publicUser }
