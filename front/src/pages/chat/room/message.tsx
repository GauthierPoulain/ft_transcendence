import useUser from "../../../data/use-user"
import {
    Message as MessageType,
    useRemoveMessage,
} from "../../../data/messages"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { Delete } from "@material-ui/icons"
import { useAuth } from "../../../data/use-auth"
import { useMemberByUser } from "../../../data/members"
import { Button, Card } from "react-bootstrap"
import "./style.scss"

function DeleteButton({ message }) {
    const { submit, isLoading } = useRemoveMessage()

    async function remove() {
        if (!isLoading) {
            await submit({
                channelId: message.channelId,
                messageId: message.id,
            })
        }
    }

    return (
        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Delete
                className="text-danger cursor-pointer"
                fontSize="inherit"
                onClick={remove}
            />
        </OverlayTrigger>
    )
}

function GameRequestCard({author}) {
    return (
        <Card style={{ backgroundColor: "black", width: "20rem", borderRadius: "22px"}}>
            <Card.Body className="game-card">
                <Card.Title className="mb-2">Game Request</Card.Title>
                <div className="author mb-2">
                    {author.nickname} asking for a game !
                </div>
                <Button variant="warning" style={{width: '100%'}}>Join</Button>
            </Card.Body>
        </Card>
    )
}

export default function Message({ message }: { message: MessageType }) {
    const auth = useAuth()
    const author = useUser(message.authorId)
    const self = useMemberByUser(auth.userId)

    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-start align-items-center gap-x-2">
                <span className="user-tag">{author.nickname}</span>
                {(self.userId === author.id || self.role !== "guest") && (
                    <DeleteButton message={message} />
                )}
            </div>
            <div>{message.content}</div>
            <GameRequestCard author={author}/>
        </div>
    )
}

