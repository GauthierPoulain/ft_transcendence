import { Connection, EntitySubscriberInterface, EventSubscriber, RemoveEvent } from "typeorm";
import { Channel } from "../entities/channel.entity";
import { Member, Role, roleRank } from "./member.entity";

@EventSubscriber()
export class MemberSubscriber implements EntitySubscriberInterface<Member> {
    constructor(connection: Connection) {
        connection.subscribers.push(this)
    }

    listenTo() {
        return Member
    }

    async afterRemove(event: RemoveEvent<Member>) {
        const members = await event.manager.find(Member, {
            channel: { id: event.entity.channelId }
        })

        // If there's no user left, delete the channel.
        if (members.length === 0) {
            await event.manager.delete(Channel, event.entity.channelId)
        }

        // Otherwise if the user was an owner, transfer ownership.
        else if (event.entity.role === Role.OWNER) {
            // Sort members by role then by id.
            const [target] = members.sort((first, second) => {
                const cmp = roleRank(first.role) - roleRank(second.role)

                return cmp !== 0 ? cmp : first.id - second.id
            })

            // Update the new owner role.
            target.role = Role.OWNER
            await event.manager.save(Member, target)
        }
    }
}
