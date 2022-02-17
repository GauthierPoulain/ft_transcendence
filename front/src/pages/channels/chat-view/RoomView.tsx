import { useEffect, useState } from "react"
import { Button, Form, InputGroup, Stack, Dropdown } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import useUser from "../../../data/use-user"
import { useMembers } from "../../../data/use-member"
import useChannel from "../../../data/use-channel"
import {
    Message,
    useCreateMessage,
    useMessages,
    useRemoveMessage,
} from "../../../data/use-message"
import "./style.scss"
import { useSWRConfig } from "swr"
import UserAvatar from "../../../components/user/UserAvatar"
import { Edit, Delete } from "@material-ui/icons"
import { useAuth } from "../../../data/use-auth"

function Member({ member }) {
    const user = useUser(member.userId)

    return (
        <div className="d-flex">
            <Link
                className="member-links mb-2 text-decoration-none d-flex"
                to={`/users/${user.id}`}
            >
                <UserAvatar className="me-2 w-8" userId={user.id} />
                <span className="m-auto ms-0">
                    {user.nickname} - {member.role}
                </span>
            </Link>
            <Dropdown>
                <Dropdown.Toggle
                    className="dropdown-toggle ms-2"
                    size="sm"
                ></Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>Ban</Dropdown.Item>
                    <Dropdown.Item>Mute</Dropdown.Item>
                    <Dropdown.Item>Kick</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

function Members({ channelId }) {
    const members = useMembers(channelId)

    return (
        <div className="members p-3 bg-dark">
            <h2>Members</h2>

            <Stack>
                {members.map((member) => (
                    <Member key={member.id} member={member} />
                ))}
            </Stack>
        </div>
    )
}

function FormMessage({ channelId }) {
    const channel = useChannel(channelId)
    const [content, setContent] = useState("")
    const { submit, isError, isLoading } = useCreateMessage()

    // Code to reset the content's state when naigating to another channel.
    useEffect(() => setContent(""), [channelId])

    useEffect(() => {
        document.getElementById("chatInput")?.focus()
    }, [isLoading])

    async function onSubmit(event: any) {
        event.preventDefault()

        if (content) {
            await submit({ channelId, content })

            setContent("")
        }
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Control
                id="chatInput"
                type="text"
                className={`bg-dark border-${
                    isError ? "danger" : "dark"
                } text-white`}
                placeholder={`Enter a content for ${channel.name}`}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                disabled={isLoading}
                autoComplete={"off"}
            />
        </Form>
    )
}

function MessageComponent({ message }: { message: Message }) {
    const author = useUser(message.authorId)
    const { submit, isLoading } = useRemoveMessage()

    async function remove() {
        await submit({ channelId: message.channelId, messageId: message.id })
    }

    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-between">
                <div className="user-tag">{author.nickname}</div>
                <Button
                    variant="danger"
                    size="sm"
                    className="me-2 del-msg"
                    disabled={isLoading}
                    onClick={remove}
                >
                    <Delete />
                </Button>
            </div>

            <div>{message.content}</div>
        </div>
    )
}

function Messages({ channelId }) {
    const messages = useMessages(channelId)

    return (
        <div
            className="flex-grow-1 d-flex flex-column-reverse gap-row-1"
            style={{ height: 0, overflow: "auto" }}
        >
            {[...messages].reverse().map((message) => (
                <MessageComponent key={message.id} message={message} />
            ))}
        </div>
    )
}

function PasswordMaintenance({ channelId }) {
    const channel = useChannel(channelId)

    const members = useMembers(channelId)
    const user = useAuth()

    let i = 0
    for (i; i < members.length; i++) {
        if (members[i].userId === user.userId) break
    }

    if (members[i].role != "owner") {
        return <></>
    }

    if (channel.type === "public") {
        return (
            <div className="d-flex">
                <Form className="w-auto ms-3">
                    <InputGroup>
                        <Form.Control
                            className="bg-white text-dark"
                            placeholder="Add password..."
                            type="password"
                        />
                        <Button type="submit">Protect channel</Button>
                    </InputGroup>
                </Form>
                <Button variant="warning" size="sm" className="ms-3">
                    Make it private
                </Button>
            </div>
        )
    }

    if (channel.type === "protected") {
        return (
            <div className="d-flex">
                <Form className="w-auto ms-3">
                    <InputGroup>
                        <Form.Control
                            className="bg-white text-dark"
                            placeholder="Change password..."
                            type="password"
                        />
                        <Button type="submit">Change</Button>
                    </InputGroup>
                </Form>
                <Button variant="warning" size="sm" className="ms-3">
                    Remove password
                </Button>
            </div>
        )
    }

    if (channel.type === "private") {
        return (
            <div className="d-flex">
                <Button variant="primary" size="sm" className="ms-3">
                    Make it public
                </Button>
            </div>
        )
    }

    return <></>
}

function Main({ channelId }) {
    const channel = useChannel(channelId)

    return (
        <div className="flex-grow-1 chat-view p-3 d-flex flex-column">
            <div>
                <div className="d-flex">
                    <h2>{channel.name}</h2>
                    <h4 className="ms-2 chan-type">[{channel.type}]</h4>
                </div>
                <div className="d-flex">
                    <Button variant="danger" size="sm">
                        Leave channel
                    </Button>
                    <PasswordMaintenance channelId={channelId} />
                </div>
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
