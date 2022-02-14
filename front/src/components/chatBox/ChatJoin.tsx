import { useState } from "react"
import "./chatjoin.scss"
import useChannel, { useJoinChannel, useJoinedChannels, usePublicChannels } from "../../data/use-channel"
import { useSWRConfig } from "swr"
import { useNavigate } from "react-router-dom"
import { Button } from 'react-bootstrap'

function JoinPublic({ channelId }) {
    const { mutate } = useSWRConfig()
    const navigate = useNavigate()
    const { submit, isError, isLoading } = useJoinChannel()

    if (isError) {
        return <p>An error occured while joining</p>
    }

    if (isLoading) {
        return <p>Joining...</p>
    }

    async function join() {
        await submit({ id: channelId, password: "" })
        mutate("/channels/joined")
        navigate(`/chat/room/${channelId}`, { replace: true })
    }

    return <Button className="chanButton" variant="primary" onClick={join}>Join</Button>
}

function JoinProtected({ channelId }) {
    const { mutate } = useSWRConfig()
    const navigate = useNavigate()
    const { submit, isError, isLoading } = useJoinChannel()
    const [password, setPassword] = useState("")

    if (isError) {
        return <p>An error occured while joining</p>
    }

    if (isLoading) {
        return <p>Joining...</p>
    }

    async function join(event: any) {
        event.preventDefault()
        
        await submit({ id: channelId, password })

        mutate("/channels/joined")
        navigate(`/chat/room/${channelId}`, { replace: true })
    }

    return <form onSubmit={join}>
        <input type="text" className="chanPlaceholder" required placeholder="Enter password..." value={password} onChange={(event) => setPassword(event.target.value)}></input>
        <Button variant="warning" className="chanButton" type="submit">Join</Button>
    </form>
}

function ChannelJoinCard({ channelId }) {
    const channel = useChannel(channelId)

    return (
        <div className="channelsList">
            <h3 className="name">{ channel.name }</h3>

            { channel.type === "public" && <JoinPublic channelId={channelId} /> }
            { channel.type === "protected" && <JoinProtected channelId={channelId} /> }
        </div>
    )
}

export default function ChatBox() {
    const pubs = usePublicChannels()
    const joined = useJoinedChannels()

    const channels = pubs.filter((id) => !joined.includes(id))

    return (
        <div>
            <h2 className="chatJoinContainer">Join or create a wanted channel !</h2>

            <div className="chanListContainer">
                { channels.map((channelId) => <ChannelJoinCard key={channelId} channelId={channelId} />) }
            </div>
        </div>
    )
}
