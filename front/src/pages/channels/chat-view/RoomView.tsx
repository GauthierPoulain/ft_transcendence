import { useEffect, useState } from "react"
import { Button, Form, InputGroup, Stack, Dropdown } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import useUser from "../../../data/use-user"
import { useMembers } from "../../../data/use-member"
import useChannel from "../../../data/use-channel"
import { useCreateMessage, useMessages } from "../../../data/use-message"
import "./style.scss"
import { useSWRConfig } from "swr"
import UserAvatar from "../../../components/user/UserAvatar"
import { Edit, Delete } from "@material-ui/icons"

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
                    childBsPrefix="member-edit"
                    bsPrefix="member-edit"
                    size="sm"
                >
                    <Edit />
                </Dropdown.Toggle>

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
                type="text"
                className={`bg-dark border-${
                    isError ? "danger" : "dark"
                } text-white`}
                placeholder={`Enter a content for ${channel.name}`}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                disabled={isLoading}
            />
        </Form>
    )
}

function Message({ message }) {
    const author = useUser(message.authorId)

    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-between">
                <div className="user-tag">{author.nickname}</div>
                <Button variant="danger" size="sm" className="me-2 del-msg">
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
                <Message key={message.id} message={message} />
            ))}
        </div>
    )
}

function PasswordMaintenance({ channelId }) {
    const channel = useChannel(channelId)

    /* Test if user is owner else -> return <></> */

    if (channel.type === "public") {
        return (
            <div>
                <Form className="w-auto ms-3">
                    <InputGroup>
                        <Form.Control
                            className="bg-white text-dark"
                            placeholder="Add password..."
                        />
                        <Button type="submit">Protect channel</Button>
                    </InputGroup>
                </Form>
            </div>
        )
    }

    return (
        <div className="d-flex">
            <Form className="w-auto ms-3">
                <InputGroup>
                    <Form.Control
                        className="bg-white text-dark"
                        placeholder="Change password..."
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
