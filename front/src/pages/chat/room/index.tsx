import { Navigate, useParams } from "react-router-dom"
import { useChannel } from "../../../data/channels"
import { MessagesProvider } from "../../../data/messages"
import "./style.scss"
import { useAuth } from "../../../data/use-auth"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorBox } from "../../../components/error/ErrorBox"
import Messages from "./messages"
import Members from "./members"
import {
    MembersProvider,
    useMemberByUser,
    useMembersLoading,
} from "../../../data/members"
import Loading from "../../../components/Loading"
import MessageInput from "./input"
import ChannelOptions from "./options"

function Main({ channelId }) {
    const channel = useChannel(channelId)!

    return (
        <div className="flex-grow-1 chat-view p-3 d-flex flex-column">
            <div>
                <div className="d-flex">
                    <h2>{channel.name}</h2>
                    <h4 className="ms-2 chan-type">[{channel.type}]</h4>
                </div>
                <ChannelOptions channel={channel} />
            </div>

            <MessagesProvider settings={channelId}>
                <Messages channelId={channelId} />
            </MessagesProvider>

            <MessageInput channelId={channelId} />
        </div>
    )
}

function Inner({ channelId }) {
    const auth = useAuth()
    const loading = useMembersLoading()
    const current = useMemberByUser(auth.userId!)

    if (loading) {
        return <Loading />
    }

    if (!current) {
        return <Navigate to="/chat" replace />
    }

    return (
        <>
            <Main channelId={channelId} />
            <Members />
        </>
    )
}

export default function RoomView() {
    const params = useParams()

    const channelId = parseInt(params.channelId as string, 10)

    return (
        <ErrorBoundary FallbackComponent={ErrorBox}>
            <MembersProvider settings={channelId}>
                <Inner channelId={channelId} />
            </MembersProvider>
        </ErrorBoundary>
    )
}
