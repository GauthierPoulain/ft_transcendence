import { useAuth } from "../../../data/use-auth"
import { useMembers } from "../../../data/use-member"
import { Dropdown } from "react-bootstrap"

function BanMember({member})
{
    console.log("ban")
    return (
        <></>
    )
}

function MuteMember({member})
{
    console.log("mute")
    return (
        <></>
    )
}

function FollowMember({member})
{
    console.log("follow")
    return (
        <></>
    )
}

function OpMember({member})
{
    console.log("op")
    return (
        <></>
    )
}

function GameRequestMember({member})
{
    console.log("request for game")
    return (
        <></>
    )
}

function DropDownAttr({ channelId, member }) {
    const auth = useAuth()
    const members = useMembers(channelId)

    const memberConnected = members.find(({ userId }) => userId === auth.userId)

    if (memberConnected?.role === "owner") {
        return (
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => BanMember(member)}>Ban</Dropdown.Item>
                <Dropdown.Item onClick={() => MuteMember(member)}>Mute</Dropdown.Item>
                <Dropdown.Item onClick={() => OpMember(member)}>Op</Dropdown.Item>
                <Dropdown.Item onClick={() => FollowMember(member)}>Follow</Dropdown.Item>
                <Dropdown.Item onClick={() => GameRequestMember(member)}>Game request</Dropdown.Item>
            </Dropdown.Menu>
        )
    }

    if (memberConnected?.role === "admin") {
        return (
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => BanMember(member)}>Ban</Dropdown.Item>
                <Dropdown.Item onClick={() => MuteMember(member)}>Mute</Dropdown.Item>
                <Dropdown.Item onClick={() => FollowMember(member)}>Follow</Dropdown.Item>
                <Dropdown.Item onClick={() => GameRequestMember(member)}>Game request</Dropdown.Item>
            </Dropdown.Menu>
        )
    }

    return (
        <Dropdown.Menu>
            <Dropdown.Item onClick={() => FollowMember(member)}>Follow</Dropdown.Item>
                <Dropdown.Item onClick={() => GameRequestMember(member)}>Game request</Dropdown.Item>
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