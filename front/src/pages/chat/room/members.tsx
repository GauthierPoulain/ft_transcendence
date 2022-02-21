import Member from "./member"
import { useMembers } from "../../../data/members"

export default function Members() {
    const members = useMembers()

    return (
        <div className="members p-3 bg-dark">
            <h2>Members</h2>

            <div className="d-flex flex-column gap-y-2">
                {members.map((member) => (
                    <Member key={member.id} member={member} />
                ))}
            </div>
        </div>
    )
}
