import { instanceToPlain } from "class-transformer";
import { AuthSocketService } from "src/auth/auth-socket.service";
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Message } from "./message.entity";

@EventSubscriber()
export class MessageSubscriber {
    constructor(connection: Connection, private sockets: AuthSocketService) {
        connection.subscribers.push(this)
    }

    listenTo() {
        return Message
    }

    afterInsert(event: InsertEvent<Message>) {
        const users = event.entity.channel.memberships.map(({ userId }) => userId)

        // TODO: Find a way to get the class transformer configuration?
        this.sockets.broadcast(users, "channel.message.new", instanceToPlain(event.entity))
    }
}
