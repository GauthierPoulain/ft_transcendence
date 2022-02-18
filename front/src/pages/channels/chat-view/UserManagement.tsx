import { useAuth } from "../../../data/use-auth"
import { useMembers } from "../../../data/use-member"
import { Dropdown } from "react-bootstrap"

function DropDownAttr({ channelId, member }) {
    const auth = useAuth()
    const members = useMembers(channelId)

    const memberConnected = members.find(({ userId }) => userId === auth.userId)

    if (memberConnected?.role === "owner") {
        return (
            <Dropdown.Menu>
                <Dropdown.Item>Ban</Dropdown.Item>
                <Dropdown.Item>Mute</Dropdown.Item>
                <Dropdown.Item>Op</Dropdown.Item>
                <Dropdown.Item>Follow</Dropdown.Item>
                <Dropdown.Item>Game request</Dropdown.Item>
            </Dropdown.Menu>
        )
    }

    if (memberConnected?.role === "admin") {
        return (
            <Dropdown.Menu>
                <Dropdown.Item>Ban</Dropdown.Item>
                <Dropdown.Item>Mute</Dropdown.Item>
                <Dropdown.Item>Follow</Dropdown.Item>
                <Dropdown.Item>Game request</Dropdown.Item>
            </Dropdown.Menu>
        )
    }

    return (
        <Dropdown.Menu>
            <Dropdown.Item>Follow</Dropdown.Item>
                <Dropdown.Item>Game request</Dropdown.Item>
        </Dropdown.Menu>
    )
}

export function SetDropDown({ channelId, member }) {
    const auth = useAuth()

    if (auth.userId === member?.userId)
    {
        return null
    }

    return (
        <Dropdown>
            <Dropdown.Toggle
                className="dropdown-toggle ms-2"
                size="sm"
            ></Dropdown.Toggle>

            <DropDownAttr channelId={channelId} member={member}/>
        </Dropdown>
    )
}