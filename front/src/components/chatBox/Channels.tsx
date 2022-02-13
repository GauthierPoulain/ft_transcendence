import { Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import "./channels.css"

import useChannel, { useJoinedChannels } from "../../data/use-channel"

function JoinedChannel({ channelId }) {
    const channel = useChannel(channelId)

    return <Link className="chans" to={`/chat/room/${channel.id}`} replace>{channel.name}</Link>
}

function JoinedChannels() {
    const channels = useJoinedChannels()

    return <Stack>
        { channels.map((channelId) => <JoinedChannel key={channelId} channelId={channelId} />) }
    </Stack>
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
