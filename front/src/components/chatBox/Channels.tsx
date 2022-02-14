import { Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import "./channels.scss"
import { Cancel } from "@material-ui/icons"
import useChannel, { useJoinedChannels } from "../../data/use-channel"

function leaveChannel()
{
    console.log("Leave chan");
}

function JoinedChannel({ channelId }) {
    const channel = useChannel(channelId)

    return (
        <div className="chanName"> 
            <Link className="chans" to={`/chat/room/${channel.id}`} replace>{channel.name}</Link>
            <div onClick={() => leaveChannel()}>
                <Cancel className="cross" />
            </div>
        </div>
    )
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
