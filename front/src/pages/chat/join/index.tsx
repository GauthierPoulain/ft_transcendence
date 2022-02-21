import { useState } from "react"
import "./chatjoin.scss"
import { useJoinChannel, useChannels } from "../../../data/channels"
import { useJoinedChannels } from "../../../data/joined-channels"
import { useSWRConfig } from "swr"
import { useNavigate } from "react-router-dom"
import { Button, Card, Form, InputGroup } from "react-bootstrap"

function JoinPublic({ channel }) {
    const { mutate } = useSWRConfig()
    const navigate = useNavigate()
    const { submit, isError, isLoading } = useJoinChannel()

    if (isError) {
        return <p className="joinMsg">An error occured while joining</p>
    }

    if (isLoading) {
        return (
            <Button style={{ width: "100%" }} disabled>
                Joining...
            </Button>
        )
    }

    async function join() {
        await submit({ channelId: channel.id, password: "" })
        mutate("/channels/joined")
        navigate(`/chat/room/${channel.id}`, { replace: true })
    }

    return (
        <Button style={{ width: "100%" }} onClick={join}>
            Join
        </Button>
    )
}

function JoinProtected({ channel }) {
    const { mutate } = useSWRConfig()
    const navigate = useNavigate()
    const { submit, isError, isLoading } = useJoinChannel()
    const [password, setPassword] = useState("")

    if (isError) {
        return <p className="joinMsg">An error occured while joining</p>
    }

    async function join(event: any) {
        event.preventDefault()

        await submit({ channelId: channel.id, password })

        mutate("/channels/joined")
        navigate(`/chat/room/${channel.id}`, { replace: true })
    }

    return (
        <Form onSubmit={join}>
            <InputGroup>
                <Form.Control
                    type="password"
                    className="bg-white text-dark"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Button type="submit" disabled={isLoading}>
                    Join
                </Button>
            </InputGroup>
        </Form>
    )
}

function ChannelJoinCard({ channel }) {
    return (
        <Card className="join-card" style={{ width: "18rem" }}>
            <Card.Body>
                <Card.Title className="mb-3">{channel.name}</Card.Title>
                {channel.type === "public" && <JoinPublic channel={channel} />}
                {channel.type === "protected" && (
                    <JoinProtected channel={channel} />
                )}
            </Card.Body>
        </Card>
    )
}

export default function ChatBox() {
    const pubs = useChannels()
    const joined = useJoinedChannels()

    const channels = pubs.filter((id) => !joined.includes(id))

    return (
        <div className="chat-join-container p-3">
            <h2>Join a channel</h2>

            {channels.length === 0 && (
                <p>There's currently no public channel to join.</p>
            )}

            {channels.length > 0 && (
                <div className="join-cards d-flex flex-wrap">
                    {channels.map((channel) => (
                        <ChannelJoinCard key={channel.id} channel={channel} />
                    ))}
                </div>
            )}
        </div>
    )
}
