import { useState } from "react"
import { Button, Form, Stack } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import useUser from "../../../data/use-user"
import { useMembers } from "../../../data/use-member"
import useChannel from "../../../data/use-channel"
import { useMessages } from "../../../data/use-message"

import "./style.scss"

function Member({ member }) {
    const user = useUser(member.userId)

    return <Link className="member-links mb-2" to={`/users/${user.id}`}>
        <img className="member-img me-2" src={user.image} alt="" />
        {user.nickname} - {member.role}
    </Link>
}

function Members({ channelId }) {
    const members = useMembers(channelId)

    return <Stack>
        { members.map((member) => <Member key={member.id} member={member} />) }
    </Stack>
}

export default function RoomView() {
    const { channelId } = useParams()

    const channel = useChannel(parseInt(channelId as string, 10))
    const messages = useMessages(parseInt(channelId as string, 10))

    const [message, setMessage] = useState("")

    const onSubmit = (event: any) => {
        event.preventDefault()

        setMessage("")
    }

    return (
        <>
            <div className="flex-grow-1 chat-view p-3 d-flex flex-column">
                <div>
                    <h2>{channel.name}</h2>
                    <Button variant="danger" size="sm">Leave channel</Button>
                </div>

                <div className="flex-grow-1">
                    {messages.map(({ id, content, authorId }) => (
                        <div key={id}>
                            <span className="h5">
                                {authorId}:{" "}
                            </span>
                            <span>{content}</span>
                        </div>
                    ))}
                </div>

                <Form onSubmit={onSubmit}>
                    <Form.Control type="text" className="bg-dark border-dark text-white" placeholder="Enter a message" value={message} onChange={(event) => setMessage(event.target.value)}  />
                </Form>
            </div>

            <div className="members p-3 bg-dark">
                <h2>Members</h2>

                <Members channelId={channelId} />
            </div>
        </>
    )
}
