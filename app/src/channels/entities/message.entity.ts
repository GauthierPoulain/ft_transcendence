import { Channel } from "./channel.entity"
import { User } from "src/users/entities/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm"

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.messages)
    author: User

    @RelationId((message: Message) => message.author)
    authorId: number

    @Column()
    content: string

    @ManyToOne(() => Channel, (channel) => channel.messages)
    channel: Channel
}
