import useUser from "../../../data/use-user"
import { useMember } from "../../../data/use-member"
import { Message as MessageType, useRemoveMessage } from "../../../data/use-message"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { Delete } from "@material-ui/icons"
import { useAuth } from "../../../data/use-auth"

function DeleteButton({ message }) {
    const { submit, isLoading } = useRemoveMessage()

    async function remove() {
        if (!isLoading) {
            await submit({ channelId: message.channelId, messageId: message.id })
        }
    }

    return (
        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Delete className="text-danger cursor-pointer" fontSize="inherit" onClick={remove} />
        </OverlayTrigger>
    )
}

export default function Message({ message }: { message: MessageType }) {
    const auth = useAuth()
    const author = useUser(message.authorId)
    const self = useMember(message.channelId, auth.userId)

    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-start align-items-center gap-x-2">
                <span className="user-tag">{author.nickname}</span>
                { (self.userId === author.id || self.role !== "guest") && <DeleteButton message={message} /> }
            </div>

            <div>{message.content}</div>
        </div>
    )
}
