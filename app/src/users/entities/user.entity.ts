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

    @Column({ unique: true })
    @Exclude()
    intra_id: number

    @Column({ unique: true })
    @Exclude()
    intra_login: string

    @Column()
    @Exclude()
    intra_image_url: string

    @Column({ nullable: true, unique: true })
    custom_name: string | null

    @Expose()
    get has_custom_image(): boolean {
        return this.custom_image !== null
    }

    @Expose()
    get image(): string {
        return this.has_custom_image ? this.custom_image : this.intra_image_url
    }

    @Column({ nullable: true })
    @Exclude()
    custom_image: string | null

    @Expose()
    get nickname(): string {
        return this.custom_name ? this.custom_name : this.intra_login
    }

    @Column({ nullable: true })
    @Exclude()
    tfa_secret: string | null

    @Expose()
    get tfa(): boolean {
        return !!this.tfa_secret
    }

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
