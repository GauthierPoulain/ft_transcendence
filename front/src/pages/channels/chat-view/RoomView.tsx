import { useEffect, useState } from "react"
import { Button, Form, Image, Stack } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import useUser from "../../../data/use-user"
import { useMembers } from "../../../data/use-member"
import useChannel from "../../../data/use-channel"
import { useCreateMessage, useMessages } from "../../../data/use-message"

import "./style.scss"
import { useSWRConfig } from "swr"
import UserAvatar from "../../../components/user/UserAvatar"

function Member({ member }) {
    const user = useUser(member.userId)

    return <Link className="member-links mb-2 text-decoration-none d-flex" to={`/users/${user.id}`}>
        <UserAvatar className="me-2 w-8" userId={user.id} />
        <span className="m-auto ms-0">{user.nickname} - {member.role}</span>
    </Link>
}

function Members({ channelId }) {
    const members = useMembers(channelId)

    return (
        <div className="members p-3 bg-dark">
            <h2>Members</h2>

            <Stack>
                { members.map((member) => <Member key={member.id} member={member} />) }
            </Stack>
        </div>
    )
}

function FormMessage({ channelId }) {
    const { mutate } = useSWRConfig()
    const channel = useChannel(channelId)
    const [content, setContent] = useState("")
    const { submit, isError, isLoading } = useCreateMessage()

    // Code to reset the content's state when naigating to another channel.
    useEffect(() => setContent(""), [channelId])

    async function onSubmit(event: any) {
        event.preventDefault()

        if (content) {
            await submit({ channelId, content })

            setContent("")
            mutate(`/channels/${channelId}/messages`)
        }
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Control type="text" className={`bg-dark border-${isError ? "danger" : "dark"} text-white`} placeholder={`Enter a content for ${channel.name}`} value={content} onChange={(event) => setContent(event.target.value)} disabled={isLoading}  />
        </Form>
    )
}

function Message({ message }) {
    const author = useUser(message.authorId)

    return (
        <div className="d-flex flex-column">
            <div>{ author.nickname }</div>
            <div>{ message.content }</div>
        </div>
    )
}

function Messages({ channelId }) {
    const messages = useMessages(channelId)

    return (
        <div className="flex-grow-1 d-flex flex-column-reverse gap-row-1" style={{ height: 0, overflow: "auto" }}>
            { [...messages].reverse().map((message) => <Message message={message} />) }
        </div>
    )
}

function Main({ channelId }) {
    const channel = useChannel(channelId)

    return (
        <div className="flex-grow-1 chat-view p-3 d-flex flex-column">
            <div>
                <h2>{channel.name}</h2>
                <Button variant="danger" size="sm">Leave channel</Button>
            </div>

            <Messages channelId={channelId} />

            <FormMessage channelId={channelId} />
        </div>
    )
}

export default function RoomView() {
    const { channelId } = useParams()

    const channel = useChannel(parseInt(channelId as string, 10))


    return (
        <>
            <Main channelId={channel.id} />
            <Members channelId={channel.id} />
        </>
    )
}
