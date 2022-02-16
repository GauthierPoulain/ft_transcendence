import { instanceToPlain } from "class-transformer";
import { AuthSocketService } from "src/auth/auth-socket.service";
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Message } from "./entities/message.entity";

@EventSubscriber()
export class MessageSubscriber implements EntitySubscriberInterface<Message> {
    constructor(connection: Connection, private auth: AuthSocketService) {
        connection.subscribers.push(this)
    }

    listenTo() {
        return Message
    }

    afterInsert(event: InsertEvent<Message>) {
        const users = event.entity.channel.memberships.map(
            ({ userId }) => userId
        )

        // TODO: Find a way to get the class transformer configuration?
        const data = instanceToPlain(event.entity, { })

        this.auth.getConnections(users).forEach((connection) => {
            connection.send(JSON.stringify({
                event: "channel.message.new",
                data
            }))
        })
    }
}
