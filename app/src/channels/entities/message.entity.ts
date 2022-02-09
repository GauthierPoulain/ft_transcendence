import { Channel } from "./channel.entity"
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.messages)
    author: User

    @Column()
    content: string

    @ManyToOne(() => Channel, channel => channel.messages)
    channel: Channel
}
