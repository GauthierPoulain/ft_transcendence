import { useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import { useChannel } from "../../../data/channels"
import { useMembers } from "../../../data/members"
import { useCreateMessage } from "../../../data/messages"
import { useRelations2 } from "../../../data/relations"
import { useAuth } from "../../../data/use-auth"

function useCanSendMessage(channelId: number): boolean {
    const auth = useAuth()
    const channel = useChannel(channelId)
    const relations = useRelations2()
    const members = useMembers()

    if (!channel) {
        return false;
    }

    if (channel.type === "direct") {
        return !members.some(({ userId }) => relations.isBlockedBy(userId))
    }

    const { muted } = members.find(
        ({ userId }) => userId === auth.userId!
    )!

    return !muted
}

export default function MessageInput({ channelId }) {
    const channel = useChannel(channelId)!
    const [content, setContent] = useState("")
    const { submit, isError, isLoading } = useCreateMessage()

    const canSendMessage = useCanSendMessage(channelId)

    // Code to reset the content's state when naigating to another channel.
    useEffect(() => setContent(""), [channelId])

    useEffect(() => {
        if (!isLoading) {
            document.getElementById("chatInput")?.focus()
        }
    }, [isLoading])

    async function onSubmit(event: any) {
        event.preventDefault()

        if (content) {
            await submit({ channelId, content })
            setContent("")
        }
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Control
                id="chatInput"
                type="text"
                className={`bg-dark border-${
                    isError ? "danger" : "dark"
                } text-white`}
                placeholder={canSendMessage ? `Enter a content for ${channel.name}` : "You can't send a message"}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                disabled={isLoading || !canSendMessage}
                autoComplete={"off"}
            />
        </Form>
    )
}
