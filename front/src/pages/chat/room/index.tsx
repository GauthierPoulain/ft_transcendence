import { useEffect, useState } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useRemoveMember } from "../../../data/use-member"
import useChannel from "../../../data/use-channel"
import {
    useCreateMessage,
    useMessages,
} from "../../../data/use-message"
import "./style.scss"
import { useAuth } from "../../../data/use-auth"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorBox } from "../../../components/error/ErrorBox"
import Messages from "./messages"
import Members from "./members"
import { MembersProvider, useMembers, useMembersLoading } from "../../../data/members"
import Loading from "../../../components/Loading"

function FormMessage({ channelId }) {
    const channel = useChannel(channelId)
    const [content, setContent] = useState("")
    const { submit, isError, isLoading } = useCreateMessage()

    // Code to reset the content's state when naigating to another channel.
    useEffect(() => setContent(""), [channelId])

    useEffect(() => {
        if (!isLoading) {
            document.getElementById("chatInput")?.focus()
        }
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

function PasswordMaintenance({ channelId }) {
    const auth = useAuth()
    const channel = useChannel(channelId)
    const members = useMembers(channelId)

    const member = members.find(({ userId }) => userId === auth.userId)

    if (member?.role !== "owner") {
        return null
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
    } else if (channel.type === "protected") {
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
    } else {
        return (
            <div className="d-flex">
                <Button variant="primary" size="sm" className="ms-3">
                    Make it public
                </Button>
            </div>
        )
    }
}

function Main({ channelId }) {
    const auth = useAuth()
    const channel = useChannel(channelId)
    const members = useMembers(channelId)

    const { submit, isLoading } = useRemoveMember()

    async function leave() {
        const member = members.find(({ userId }) => userId === auth.userId)

        await submit({ id: member!.id, channelId: channel.id })
    }

    return (
        <div className="flex-grow-1 chat-view p-3 d-flex flex-column">
            <div>
                <div className="d-flex">
                    <h2>{channel.name}</h2>
                    <h4 className="ms-2 chan-type">[{channel.type}]</h4>
                </div>
                <div className="d-flex">
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={leave}
                        disabled={isLoading}
                    >
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

function Inner({ channelId }) {
    const loading = useMembersLoading()

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <Main channelId={channelId} />
            <Members />
        </>
    )
}

export default function RoomView() {
    const params = useParams()

    const channelId = parseInt(params.channelId as string, 10)

    return (
        <ErrorBoundary FallbackComponent={ErrorBox} onError={() => {}}>
            <MembersProvider channelId={channelId}>
                <Inner channelId={channelId} />
            </MembersProvider>
        </ErrorBoundary>
    )
}
