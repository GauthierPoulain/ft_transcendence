import { useMessagesLoading, useMessages } from "../../../data/messages"
import Message from "./message"

export default function Messages() {
    const loading = useMessagesLoading()
    const messages = useMessages()

    const sorted = [...messages].sort((first, second) => {
        return second.id - first.id
    })

    return (
        <div
            className="flex-grow-1 d-flex flex-column-reverse gap-row-1"
            style={{ height: 0, overflow: "auto" }}
        >
            {loading && <p>Messages are loading, just wait a little...</p>}

            {sorted.map((message) => (
                <Message key={message.id} message={message} />
            ))}
        </div>
    )
}
