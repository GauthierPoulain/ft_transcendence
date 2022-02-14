import { Link } from "react-router-dom"
import useChannel, { useJoinedChannels } from "../../data/use-channel"

function JoinedChannel({ channelId }) {
    const channel = useChannel(channelId)

    return (
        <li>
            <Link className="text-decoration-none" to={`/chat/room/${channel.id}`} replace>{channel.name}</Link>
        </li>
    )
}

function JoinedChannels() {
    const channels = useJoinedChannels()

    return (
        <ul className="list-unstyled mt-3">
            { channels.map((channelId) => <JoinedChannel key={channelId} channelId={channelId} />) }
        </ul>
    )
}

export default function Channels() {
    return (
        <div className="mx-4">
            <h2>Channels</h2>

            <ul className="list-unstyled">
                <li><Link className="chanLinks" to="/chat">Join a channel</Link></li>
                <li><Link className="chanLinks" to="/chat/create">Create a channel</Link></li>
            </ul>

            <JoinedChannels />
        </div>
    )
}
