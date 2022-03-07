import useUser from "../../../data/use-user"
import {
    Message as MessageType,
    useRemoveMessage,
} from "../../../data/messages"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { useAuth } from "../../../data/use-auth"
import { useMemberByUser } from "../../../data/members"
import { Button, Card } from "react-bootstrap"
import "./style.scss"
import { Delete } from "@mui/icons-material"
import { useRelations } from "../../../data/relations"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useState } from "react"
import { useChannel } from "../../../data/channels"

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

function GameRequestCard({ author }) {
    return (
        <Card
            style={{
                backgroundColor: "black",
                width: "20rem",
                borderRadius: "22px",
            }}
        >
            <Card.Body className="game-card">
                <Card.Title className="mb-2">Game Request</Card.Title>
                <div className="author mb-2">
                    {author.nickname} asking for a game !
                </div>
                <Button variant="warning" style={{ width: "100%" }}>
                    Play
                </Button>
            </Card.Body>
        </Card>
    )
}

function IsBlockedUser(id: number) {
    const auth = useAuth()
    const relations = useRelations()
    const user = useUser(id)

    const blocked = relations.filter(
        ({ currentId, kind }) => currentId === auth.userId && kind === "blocked"
    )

    for (let i = 0; i < blocked.length; i++) {
        if (blocked[i].targetId === user.id) return true
    }

    return false
}

export default function Message({ message }: { message: MessageType }) {
    const auth = useAuth()
    const author = useUser(message.authorId)
    const channel = useChannel(message.channelId)!
    const self = useMemberByUser(auth.userId!)!
    const [show, setShow] = useState(false)

    // TODO: Deduplicate code for message
    if (IsBlockedUser(author.id) && !show) {
        return (
            <div className="d-flex flex-column">
                <div className="d-flex justify-content-start align-items-center gap-x-2">
                    <p className="fst-italic text-secondary">
                        Message from blocked user
                    </p>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Show</Tooltip>}
                    >
                        <VisibilityIcon
                            className="text-secondary cursor-pointer mb-3"
                            fontSize="inherit"
                            onMouseDown={() => setShow(true)}
                        />
                    </OverlayTrigger>
                    <div className="mb-3">
                        {(self.userId === author.id ||
                            (self.role !== "guest" && channel.type !== "direct")) && (
                            <DeleteButton message={message} />
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-start align-items-center gap-x-2">
                <span className="user-tag">{author.nickname}</span>
                {(self.userId === author.id ||
                    (self.role !== "guest" && channel.type !== "direct")) && (
                    <DeleteButton message={message} />
                )}
            </div>
            <div>{message.content}</div>
        </div>
    )
}

//<GameRequestCard author={author}/>
