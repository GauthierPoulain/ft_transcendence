import { useState } from "react"
import "./chatjoin.css"
import useChannel, { useJoinChannel, useJoinedChannels, usePublicChannels } from "../../data/use-channel"
import { useSWRConfig } from "swr"
import { useNavigate } from "react-router-dom"

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

    return <button onClick={join}>Join</button>
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
        <input type="text" required placeholder="Enter password..." value={password} onChange={(event) => setPassword(event.target.value)}></input>
        <button type="submit">Join</button>
    </form>
}

function ChannelJoinCard({ channelId }) {
    const channel = useChannel(channelId)

    return (
        <div>
            <h3>{ channel.name }</h3>

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

            { channels.map((channelId) => <ChannelJoinCard key={channelId} channelId={channelId} />) }
        </div>
    )
}
