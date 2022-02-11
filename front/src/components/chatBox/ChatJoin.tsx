import "./chatjoin.css"
import { api } from "../../services/api"
import { Channel } from "../../services/channels"

function ChannelJoinCard({ channelId }) {
    const { data, isLoading, isError } = api.endpoints.getChannel.useQuery(channelId)

    if (isError) {
        return <p>An error occured while fetching channel</p>
    }

    if (isLoading) {
        return <p>Loading channel...</p>
    }

    const channel = data as Channel

    return (
        <div>
            <h3>{ channel.name }</h3>
        </div>
    )
}

export default function ChatBox() {
    const { data, isLoading, isError } = api.endpoints.publicChannels.useQuery()

    if (isError) {
        return <p>An error occured while fetching public channels...</p>
    }

    if (isLoading) {
        return <p>Loading public channels...</p>
    }

    const channels = data as number[]

    return (
        <div>
            <h2 className="chatJoinContainer">Join or create a wanted channel !</h2>
            { channels.map((channelId) => <ChannelJoinCard key={channelId} channelId={channelId} />) }
        </div>
    )
}
