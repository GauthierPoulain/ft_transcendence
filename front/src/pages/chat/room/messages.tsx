import type { Message as MessageType } from "../../../data/use-message"
import Message from "./message"

export default function Messages({ messages }: { messages: MessageType[] }) {
    const sorted = [...messages].sort((first, second) => {
        return second.id - first.id
    })

    return (
        <div className="flex-grow-1 d-flex flex-column-reverse gap-row-1" style={{ height: 0, overflow: "auto" }}>
            {sorted.map((message) => (
                <Message key={message.id} message={message} />
            ))}
        </div>
    )
}
