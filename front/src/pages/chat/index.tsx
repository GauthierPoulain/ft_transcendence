import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"
import { ChannelsProvider, useChannels } from "../../data/channels"

import "./style.scss"

function JoinedChannel({ channel }) {
    return (
        <li>
            <Link className="text-decoration-none chan-text" to={`/chat/room/${channel.id}`} replace>{channel.name}</Link>
        </li>
    )
}

function JoinedChannels() {
    // TODO: Transformed to joined channels
    const channels = useChannels()

    return (
        <ul className="list-unstyled mt-3">
            { channels.map((channel) => <JoinedChannel key={channel.id} channel={channel} />) }
        </ul>
    )
}

function Sidebar() {
    return (
        <div className="p-3 chan-list bg-dark">
            <h2>Channels</h2>

            <ul className="list-unstyled test">
                <li><Link className="header-text" to="/chat">Join a channel</Link></li>
                <li><Link className="header-text" to="/chat/create">Create a channel</Link></li>
            </ul>

            <JoinedChannels />
        </div>
    )
}

function Inner() {
    return (
        <div className="d-flex flex-grow-1">
            <Sidebar />
            <Outlet />
        </div>
    )
}

export default function Chat() {
    return (
        <ChannelsProvider>
            <Inner />
        </ChannelsProvider>
    )
}
