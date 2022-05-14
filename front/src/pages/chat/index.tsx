import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"
import { ChannelsProvider, useChannelsLoading } from "../../data/channels"
import {
    JoinedChannelsProvider,
    useJoinedChannels,
    useJoinedChannelsLoading,
} from "../../data/joined-channels"
import Loading from "../../components/Loading"

import "./style.scss"
import { useAuth } from "../../data/use-auth"
import { NavLink } from "react-router-dom"

function JoinedChannel({ channel }) {
    return (
        <li>
            <NavLink
                className={({ isActive }) =>
                    `text-decoration-none chan-text ${
                        isActive ? "fw-bold" : ""
                    }`
                }
                to={`/chat/room/${channel.id}`}
                replace
            >
                {channel.name}
            </NavLink>
        </li>
    )
}

function JoinedChannels() {
    const channels = useJoinedChannels()

    return (
        <ul className="list-unstyled mt-3">
            {channels.map((channel) => (
                <JoinedChannel key={channel.id} channel={channel} />
            ))}
        </ul>
    )
}

function Sidebar() {
    return (
        <div className="p-3 chan-list bg-dark">
            <h2>Channels</h2>

            <ul className="list-unstyled">
                <li>
                    <NavLink
                        className={({ isActive }) =>
                            `header-text ${isActive ? "fw-bold" : ""}`
                        }
                        to="/chat"
                        end
                    >
                        Join a channel
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className={({ isActive }) =>
                            `header-text ${isActive ? "fw-bold" : ""}`
                        }
                        to="/chat/create"
                    >
                        Create a channel
                    </NavLink>
                </li>
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
    const auth = useAuth()

    return (
        <ChannelsProvider>
            <JoinedChannelsProvider settings={auth.userId!}>
                <Inner />
            </JoinedChannelsProvider>
        </ChannelsProvider>
    )
}
