import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { instanceToPlain } from "class-transformer"
import { SocketsService } from "src/sockets/sockets.service"
import { User } from "src/users/entities/user.entity"
import { Repository } from "typeorm"
import { Channel } from "../entities/channel.entity"
import { Message } from "./message.entity"

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messages: Repository<Message>,
        private sockets: SocketsService
    ) {}

    async create(
        channel: Channel,
        author: User,
        content: string
    ): Promise<Message> {
        let message = new Message()

        message.channel = channel
        message.author = author
        message.content = content

        message = await this.messages.save(message)

        this.publish("created", instanceToPlain(message, {}))

        return message
    }

    findOne(
        channelId: Channel["id"],
        messageId: Channel["id"]
    ): Promise<Message> {
        return this.messages.findOne({
            where: {
                id: messageId,
                channel: { id: channelId },
            },
        })
    }

    findAll(channel: Channel): Promise<Message[]> {
        return this.messages.find({
            where: {
                channel: { id: channel.id },
            },
        })
    }

    async remove(message: Message) {
        const published = { id: message.id, channelId: message.channelId }

        await this.messages.remove(message)

        this.publish("removed", published)
    }

    publish(event: string, data: any) {
        this.sockets.publish(
            [`channels.${data.channelId}`],
            `messages.${event}`,
            data
        )
    }
}
