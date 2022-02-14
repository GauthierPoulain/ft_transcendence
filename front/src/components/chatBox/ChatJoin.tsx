import "./chatjoin.scss"
import useChannel, { useJoinedChannels, usePublicChannels } from "../../data/use-channel"
import { Button } from "react-bootstrap"

function JoinPublic({ channelId }) {
    return <Button variant="primary" className="chanButton">Join</Button>
}

function JoinProtected({ channelId }) {
    return <form>
        <input type="text" className="chanPlaceholder" required placeholder="Enter password..."></input>
        <Button type="submit" variant="warning" className="chanButton">Join</Button>
    </form>
}

function ChannelJoinCard({ channelId }) {
    const channel = useChannel(channelId)

    return (
        <div className="channelsList">
            <h3 className="name">{ channel.name }</h3>

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

            <div className="chanListContainer">
                { channels.map((channelId) => <ChannelJoinCard key={channelId} channelId={channelId} />) }
            </div>
        </div>
    )
}
