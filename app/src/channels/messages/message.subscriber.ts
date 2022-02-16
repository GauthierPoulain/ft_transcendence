import { instanceToPlain } from "class-transformer";
import { AuthSocketService } from "src/auth/auth-socket.service";
import { Connection, EventSubscriber, InsertEvent } from "typeorm";
import { MembersService } from "../members/members.service";
import { Message } from "./message.entity";

@EventSubscriber()
export class MessageSubscriber {
    constructor(connection: Connection, private sockets: AuthSocketService, private members: MembersService) {
        connection.subscribers.push(this)
    }

    listenTo() {
        return Message
    }

    async afterInsert({ entity: message }: InsertEvent<Message>) {
        const members = await this.members.findAll(message.channelId)
        const users = members.map(({ userId }) => userId)

        // TODO: Find a way to get the class transformer configuration?
        this.sockets.broadcast(users, "channel.message.new", instanceToPlain(message))
    }
}
