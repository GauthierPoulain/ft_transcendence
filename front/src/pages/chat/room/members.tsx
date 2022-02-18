import Member from "./member"
import { useMembers } from "../../../data/use-member.ts"

export default function Members({ channelId }) {
    const members = useMembers(channelId)

    return (
        <div className="members p-3 bg-dark">
            <h2>Members</h2>

            <div className="d-flex flex-column gap-y-2">
                {members.map((member) => <Member key={member.id} member={member} />)}
            </div>
        </div>
    )
}
