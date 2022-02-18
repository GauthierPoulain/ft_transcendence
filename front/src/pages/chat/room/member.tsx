import useUser from "../../../data/use-user"
import UserAvatar from "../../../components/user/UserAvatar"
import { Link } from "react-router-dom"

import { useAuth } from "../../../data/use-auth"
import { useMember } from "../../../data/use-member"
import { Dropdown } from "react-bootstrap"
import { MoreVert } from "@material-ui/icons"

function OwnerOptions({ member }) {
    return (
        <>
            <Dropdown.Header>Moderation</Dropdown.Header>
            { member.role === "admin" && <Dropdown.Item>Demote</Dropdown.Item> }
            { member.role === "guest" && <Dropdown.Item>Promote</Dropdown.Item> }
            { member.role !== "owner" && <Dropdown.Item>Kick</Dropdown.Item> }
            { member.role !== "owner" && <Dropdown.Item>Mute</Dropdown.Item> }
        </>
    )
}

function AdminOptions({ member }) {
    return (
        <>
            <Dropdown.Header>Moderation</Dropdown.Header>
            { member.role === "guest" && <Dropdown.Item>Kick</Dropdown.Item> }
            { member.role === "guest" && <Dropdown.Item>Mute</Dropdown.Item> }
        </>
    )
}

function CommonOptions() {
    return (
        <>
            <Dropdown.Header>Interaction</Dropdown.Header>
            <Dropdown.Item>Block</Dropdown.Item>
            <Dropdown.Item>Unblock</Dropdown.Item>
            <Dropdown.Item>Follow</Dropdown.Item>
            <Dropdown.Item>Unfollow</Dropdown.Item>
            <Dropdown.Item>Message</Dropdown.Item>
        </>
    )
}

function Options({ member }) {
    const auth = useAuth()

    const current = useMember(member.channelId, auth.userId)

    if (current.id === member.id) {
        return null
    }

    return (
        <Dropdown align="end">
            <Dropdown.Toggle as={MoreVert} className="cursor-pointer" fontSize="small" />

            <Dropdown.Menu variant="dark">
                { current.role === "owner" && <OwnerOptions member={member} /> }
                { current.role === "admin" && <AdminOptions member={member} /> }
                <CommonOptions />
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default function Member({ member }) {
    const user = useUser(member.userId)

    return (
        <div className="d-flex align-items-center justify-content-between gap-x-2">
            <Link className="member-links text-decoration-none d-flex align-items-center" to={`/users/${user.id}`}>
                <UserAvatar className="me-2 w-8" userId={user.id} />
                <span className="ms-0">
                    {user.nickname} - {member.role}
                </span>
            </Link>

            <Options member={member} />
        </div>
    )
}
