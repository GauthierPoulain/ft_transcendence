import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"
import { ChannelsProvider, useChannels, useChannelsLoading } from "../../data/channels"
import { JoinedChannelsProvider, useJoinedChannels, useJoinedChannelsLoading } from "../../data/joined-channels"
import Loading from "../../components/Loading"

import "./style.scss"

function JoinedChannel({ channel }) {
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
            { channels.map((channel) => <JoinedChannel key={channel.id} channel={channel} />) }
        </ul>
    )
}

function Sidebar() {
    return (
        <div className="p-3 chan-list bg-dark">
            <h2>Channels</h2>

            <ul className="list-unstyled">
                <li><Link className="header-text" to="/chat">Join a channel</Link></li>
                <li><Link className="header-text" to="/chat/create">Create a channel</Link></li>
            </ul>

            <JoinedChannels />
        </div>
    )
}

function Inner() {
    const one = useChannelsLoading()
    const two = useJoinedChannelsLoading()

    if (one || two) {
        return <Loading />
    }

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
            <JoinedChannelsProvider>
                <Inner />
            </JoinedChannelsProvider>
        </ChannelsProvider>
    )
}
