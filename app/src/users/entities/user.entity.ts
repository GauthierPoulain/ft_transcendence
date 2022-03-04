import { Member } from "src/members/member.entity"
import { Message } from "src/channels/messages/message.entity"
import { Match } from "src/matches/match.entity"
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Exclude, Expose } from "class-transformer"
import { Relation } from "src/relations/relation.entity"
import { DirectChannel } from "src/channels/entities/channel.entity"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Exclude()
    intra_id: number

    @Column()
    intra_login: string

    @Column()
    @Exclude()
    intra_image_url: string

    @Expose()
    get image(): string {
        return this.intra_image_url
    }

    @Expose()
    get nickname(): string {
        return this.intra_login
    }

    @Column({ default: "" })
    @Exclude()
    tfa_secret: string

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
    @OneToMany(() => Relation, (relation) => relation.current)
    _relations_current: Relation[]

    @Exclude()
    @OneToMany(() => Relation, (relation) => relation.target)
    _relations_target: Relation[]

    @Exclude()
    @OneToMany(() => DirectChannel, (direct) => direct.userOne)
    _directchannel_userone: DirectChannel[]

    @Exclude()
    @OneToMany(() => DirectChannel, (direct) => direct.userTwo)
    _directchannel_usertwo: DirectChannel[]
}
