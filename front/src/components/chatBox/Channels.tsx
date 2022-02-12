import { Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useResource, useSubscription } from "rest-hooks"
import { ChannelResource } from "../../api/resources/ChannelResource"
import { api } from "../../services"
import { Channel } from "../../services/channels"
import "./channels.css"

function JoinedChannel({ channelId }) {
    const { data, isLoading, isError } = api.endpoints.getChannel.useQuery(channelId)

    if (isError) {
        return <p>Error while loading channel</p>
    }

    if (isLoading) {
        return <p>Loading channel...</p>
    }

    const channel = data as Channel

    return <Link className="chans" to={`/chat/room/${channel.id}`} replace>{channel.name}</Link>
}

function JoinedChannels() {
    const { data, isLoading, isError } = api.endpoints.joinedChannels.useQuery()

    if (isError) {
        return <p>An error occured while loading joined channels.</p>
    }

    if (isLoading) {
        return <p>Loading joined channels...</p>
    }

    const channels = data as number[]

    return <Stack>
        { channels.map((channelId) => <JoinedChannel key={channelId} channelId={channelId} />) }
    </Stack>
//                            {channels.map((channel) => (
//                                <Link
//                                    key={channel.id}
//                                    className="chans"
//                                    to={`/chat/room/${channel.id}`}
//                                >
//                                    {channel.name}
//                                </Link>
//                            ))}
}

export default function Channels() {

    return (
        <div className="chatleft">
            <div className="channels">
                <div className="container chanContainer">
                    <h2>Channels</h2>

                    <Stack gap={3}>
                        <Stack>
                            <Link className="chanLinks" to="/chat">
                                Join a channel
                            </Link>
                            <Link className="chanLinks" to="/chat/create">
                                Create a channel
                            </Link>
                        </Stack>

                        <JoinedChannels />
                    </Stack>
                </div>
            </div>
        </div>
    )
}
