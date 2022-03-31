import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { instanceToPlain } from "class-transformer"
import { MembersService } from "src/members/members.service"
import { RelationsService } from "src/relations/relations.service"
import { SocketsService } from "src/sockets/sockets.service"
import { User } from "src/users/entities/user.entity"
import { Not, Repository } from "typeorm"
import { Channel } from "../entities/channel.entity"
import { Message } from "./message.entity"

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messages: Repository<Message>,
        private sockets: SocketsService,
        private members: MembersService,
        private relations: RelationsService
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

    async canSendMessage(channel: Channel, authorId: number): Promise<boolean> {
        const member = await this.members.findOneWithChannelAndUser(
            channel.id,
            authorId
        )

        if (!member) {
            return false
        }

        // If the channel is a direct message channel, check if the other user hasn't blocked.
        // the author.
        if (channel.type === "direct") {
            const other = await this.members.findOneReal({
                where: {
                    channel: { id: channel.id },
                    user: { id: Not(authorId) },
                },
            })

            return (
                other &&
                !(await this.relations.isBlocking(other.userId, authorId))
            )
        }

        // Otherwise, check if the user isn't muted or is an admin.
        return !member.muted || member.isAdmin
    }
}
