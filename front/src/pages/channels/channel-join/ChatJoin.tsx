import { useState } from "react"
import "./chatjoin.scss"
import useChannel, { useJoinChannel, useJoinedChannels, usePublicChannels } from "../../../data/use-channel"
import { useSWRConfig } from "swr"
import { useNavigate } from "react-router-dom"
import { Button, Card, Form, InputGroup } from 'react-bootstrap'

function JoinPublic({ channelId }) {
    const { mutate } = useSWRConfig()
    const navigate = useNavigate()
    const { submit, isError, isLoading } = useJoinChannel()

    if (isError) {
        return <p className="joinMsg">An error occured while joining</p>
    }

    if (isLoading) {
        return <Button style={{ width: '100%' }} disabled>Joining...</Button>
    }

    async function join() {
        await submit({ id: channelId, password: "" })
        mutate("/channels/joined")
        navigate(`/chat/room/${channelId}`, { replace: true })
    }

    return <Button style={{ width: '100%' }} onClick={join}>Join</Button>
}

function JoinProtected({ channelId }) {
    const { mutate } = useSWRConfig()
    const navigate = useNavigate()
    const { submit, isError, isLoading } = useJoinChannel()
    const [password, setPassword] = useState("")

    if (isError) {
        return <p className="joinMsg">An error occured while joining</p>
    }

    async function join(event: any) {
        event.preventDefault()
        
        await submit({ id: channelId, password })

        mutate("/channels/joined")
        navigate(`/chat/room/${channelId}`, { replace: true })
    }

    return <Form onSubmit={join}>
        <InputGroup>
            <Form.Control className="bg-white text-dark" placeholder="Enter password..." value={password} onChange={(event) => setPassword(event.target.value)}/>
            <Button type="submit" disabled={isLoading}>Join</Button>
        </InputGroup>
    </Form>
}

function ChannelJoinCard({ channelId }) {
    const channel = useChannel(channelId)

    return (
        <Card className="bg-transparent m-2" style={{ width: '18rem' }}>
          <Card.Body className="join-card">
            <Card.Title className="mb-3">{ channel.name }</Card.Title>
            { channel.type === "public" && <JoinPublic channelId={channelId} /> }
            { channel.type === "protected" && <JoinProtected channelId={channelId} /> }
          </Card.Body>
        </Card>
    )
}

export default function ChatBox() {
    const pubs = usePublicChannels()
    const joined = useJoinedChannels()

    const channels = pubs.filter((id) => !joined.includes(id))

    return (
        <div className="chat-join-container p-3">
            <h2>Join a channel</h2>

            { channels.length === 0 && <p>There's currently no public channel to join.</p> }

            { channels.length > 0 && <div className="d-flex flex-wrap">
                { channels.map((channelId) => <ChannelJoinCard key={channelId} channelId={channelId} />) }
            </div> }
        </div>
    )
}
