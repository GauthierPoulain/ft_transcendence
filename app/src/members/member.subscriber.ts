import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    RemoveEvent,
} from "typeorm"
import { Member, Role, roleRank } from "./member.entity"

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
            channel: { id: event.entity.channelId },
        })

        // If the user was an owner, transfer ownership.
        if (event.entity.role === Role.OWNER) {
            // Sort members by role then by id.
            const [target] = members.sort((first, second) => {
                const cmp = roleRank(first.role) - roleRank(second.role)

                return cmp !== 0 ? cmp : first.id - second.id
            })

            if (target) {
                // Update the new owner role.
                target.role = Role.OWNER
                await event.manager.save(Member, target)
            }
        }
    }
}
