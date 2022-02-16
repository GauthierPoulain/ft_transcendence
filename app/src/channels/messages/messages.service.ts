import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Channel } from "../entities/channel.entity";
import { Message } from "./message.entity";

@Injectable()
export class MessagesService {
    constructor(@InjectRepository(Message) private readonly messages: Repository<Message>) {
    }

    create(channel: Channel, author: User, content: string): Promise<Message> {
        const message = new Message()

        message.channel = channel
        message.author = author
        message. content = content
        
        return this.messages.save(message)
    }

    findAll(channel: Channel): Promise<Message[]> {
        return this.messages.find({
            where: {
                channel: { id: channel.id }
            }
        })
    }

    async remove(message: Message) {
        await this.messages.remove(message)
    }
}
