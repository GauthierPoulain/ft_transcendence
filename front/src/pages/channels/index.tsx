import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"
import useChannel, { useJoinedChannels } from "../../data/use-channel"

import "./style.scss"

function JoinedChannel({ channelId }) {
    const channel = useChannel(channelId)

    return (
        <li>
            <Link className="text-decoration-none chan-text" to={`/chat/room/${channel.id}`} replace>{channel.name}</Link>
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

function Sidebar() {
    return (
        <div className="mx-4 p-3 chan-list">
            <h2>Channels</h2>

            <ul className="list-unstyled test">
                <li><Link className="header-text" to="/chat">Join a channel</Link></li>
                <li><Link className="header-text" to="/chat/create">Create a channel</Link></li>
            </ul>

            <JoinedChannels />
        </div>
    )
}

export default function Chat() {
    return (
        <div className="d-flex mt-3">
            <Sidebar />
            <Outlet />
        </div>
    )
}
