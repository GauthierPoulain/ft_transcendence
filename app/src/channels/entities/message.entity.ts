import { Channel } from "./channel.entity"
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User)
    @JoinColumn()
    sender: User

    @Column()
    content: string

    @ManyToOne(() => Channel, channel => channel.messages)
    channel: Channel
}
