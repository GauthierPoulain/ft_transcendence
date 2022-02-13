import "./chatjoin.css"
import useChannel, { usePublicChannels } from "../../data/use-channel"

function ChannelJoinCard({ channelId }) {
    const channel = useChannel(channelId)

    return (
        <div>
            <h3>{ channel.name }</h3>
        </div>
    )
}

export default function ChatBox() {
    const channels = usePublicChannels()

    return (
        <div>
            <h2 className="chatJoinContainer">Join or create a wanted channel !</h2>
            { channels.map((channelId) => <ChannelJoinCard key={channelId} channelId={channelId} />) }
        </div>
    )
}
