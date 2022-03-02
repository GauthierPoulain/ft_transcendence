import useUser from "../../../data/use-user"
import UserAvatar from "../../../components/user/UserAvatar"
import { Link } from "react-router-dom"

import { useAuth } from "../../../data/use-auth"
import { Dropdown } from "react-bootstrap"
import { MoreVert } from "@material-ui/icons"
import { useMemberByUser } from "../../../data/members"
import { useRemoveMember, useUpdateMember } from "../../../data/use-member"
import { useIsBlocked, useIsFriend } from "../../../data/relations"

function OwnerOptions({ member }) {
    const { submit: submitUpdate, isLoading: loadingUpdate } = useUpdateMember()
    const { submit: submitRemove, isLoading: loadingRemove } = useRemoveMember()

    const isLoading = loadingUpdate || loadingRemove

    const submit = (action: any) => () => {
        return action === "kick" ? submitRemove({ id: member.id }) : submitUpdate({ id: member.id, action })
    }

    return (
        <>
            <Dropdown.Header>Moderation</Dropdown.Header>
            {member.role === "admin" && <Dropdown.Item disabled={isLoading} onClick={submit("demote")}>Demote</Dropdown.Item>}
            {member.role === "guest" && <Dropdown.Item disabled={isLoading} onClick={submit("promote")}>Promote</Dropdown.Item>}
            <Dropdown.Item disabled={isLoading} onClick={submit("kick")}>Kick</Dropdown.Item>
            {member.muted && <Dropdown.Item disabled={isLoading} onClick={submit("unmute")}>Unmute</Dropdown.Item>}
            {!member.muted && <Dropdown.Item disabled={isLoading} onClick={submit("mute")}>Mute</Dropdown.Item>}
        </>
    )
}

function AdminOptions({ member }) {
    const { submit: submitUpdate, isLoading: loadingUpdate } = useUpdateMember()
    const { submit: submitRemove, isLoading: loadingRemove } = useRemoveMember()

    const isLoading = loadingUpdate || loadingRemove

    const submit = (action: any) => () => {
        return action === "kick" ? submitRemove({ id: member.id }) : submitUpdate({ id: member.id, action })
    }

    return (
        <>
            <Dropdown.Header>Moderation</Dropdown.Header>
            <Dropdown.Item disabled={isLoading} onClick={submit("kick")}>Kick</Dropdown.Item>
            {member.muted && <Dropdown.Item disabled={isLoading} onClick={submit("unmute")}>Unmute</Dropdown.Item>}
            {!member.muted && <Dropdown.Item disabled={isLoading} onClick={submit("mute")}>Mute</Dropdown.Item>}
        </>
    )
}

function CommonOptions({ member }) {
    const isBlocked = useIsBlocked(member.userId)
    const isFriend = useIsFriend(member.userId)

    return (
        <>
            <Dropdown.Header>Interaction</Dropdown.Header>
            <Dropdown.Item>{ isBlocked ? "Unblock" : "Block" }</Dropdown.Item>
            <Dropdown.Item>{ isFriend ? "Remove friend" : "Add friend" }</Dropdown.Item>
            <Dropdown.Item>Message</Dropdown.Item>
            <Dropdown.Item>Game Request</Dropdown.Item>
        </>
    )
}

function Options({ member }) {
    const auth = useAuth()

    const current = useMemberByUser(auth.userId)

    if (current.id === member.id) {
        return null
    }

    return (
        <Dropdown align="end">
            <Dropdown.Toggle
                as={MoreVert}
                className="cursor-pointer"
                fontSize="small"
            />

            <Dropdown.Menu variant="dark">
                {current.role === "owner" && member.role !== "owner" && <OwnerOptions member={member} />}
                {current.role === "admin" && member.role === "guest" && <AdminOptions member={member} />}
                <CommonOptions member={member} />
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default function Member({ member }) {
    const user = useUser(member.userId)

    return (
        <div className="d-flex align-items-center justify-content-between gap-x-2">
            <Link
                className="member-links text-decoration-none d-flex align-items-center"
                to={`/users/${user.id}`}
            >
                <UserAvatar className="me-2 w-8" userId={user.id} />
                <span className="ms-0">
                    {user.nickname} - {member.role}
                </span>
            </Link>

            <Options member={member} />
        </div>
    )
}
