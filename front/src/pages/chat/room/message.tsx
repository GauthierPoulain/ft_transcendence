import useUser from "../../../data/use-user"
import { useMember } from "../../../data/use-member"
import { Message as MessageType, useRemoveMessage } from "../../../data/use-message"
import { Button } from "react-bootstrap"
import { Delete } from "@material-ui/icons"
import { useAuth } from "../../../data/use-auth"

function DeleteButton({ message }) {
    const { submit, isLoading } = useRemoveMessage()

    async function remove() {
        await submit({ channelId: message.channelId, messageId: message.id })
    }

    return (
        <Button variant="danger" size="sm" disabled={isLoading} onClick={remove}>
            <Delete fontSize="inherit" />
        </Button>
    )
}

export default function Message({ message }: { message: MessageType }) {
    const auth = useAuth()
    const author = useUser(message.authorId)
    const self = useMember(message.channelId, auth.userId)

    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-between">
                <div className="user-tag">{author.nickname}</div>

                { (self.userId === author.id || self.role !== "guest") && <DeleteButton message={message} /> }
            </div>

            <div>{message.content}</div>
        </div>
    )
}
