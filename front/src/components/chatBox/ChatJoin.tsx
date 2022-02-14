import "./chatjoin.css"
import useChannel, { useJoinedChannels, usePublicChannels } from "../../data/use-channel"

function JoinPublic({ channelId }) {
    return <button>Join</button>
}

function JoinProtected({ channelId }) {
    return <form>
        <input type="text" required placeholder="Enter password..."></input>
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
