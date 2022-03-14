import { useEffect, useRef, useState } from "react"
import { Form } from "react-bootstrap"
import { useChannel } from "../../../data/channels"
import { useMembers } from "../../../data/members"
import { useRelations2 } from "../../../data/relations"
import { useAuth } from "../../../data/use-auth"
import { fetcherPost, useSubmit } from "../../../data/use-fetch"

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
    const canSend = useCanSendMessage(channelId)
    const inputElement = useRef<HTMLInputElement>(null);

    // Message sending hook.
    const { submit, isError, isLoading } = useSubmit(
        ({ channelId, content }: { channelId: number, content: string }) =>
            fetcherPost(`/channels/${channelId}/messages`, { content }),
    )

    async function onSubmit(event: any) {
        event.preventDefault()

        if (content) {
            await submit({ channelId, content })
            setContent("")
        }
    }

    // Focus input when loading state change (when the input is no longer disabled).
    useEffect(() => {
        if (!isLoading) {
            inputElement.current?.focus()
        }
    }, [isLoading])

    // Code to reset the content's state when naigating to another channel.
    useEffect(() => {
        setContent("")
    }, [channelId])


    return (
        <Form onSubmit={onSubmit}>
            <Form.Control
                ref={inputElement}
                type="text"
                className={`bg-dark border-${
                    isError ? "danger" : "dark"
                } text-white`}
                placeholder={canSend ? `Enter a message for ${channel.name}` : "You can't send a message"}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                disabled={isLoading || !canSend}
                autoComplete={"off"}
            />
        </Form>
    )
}
