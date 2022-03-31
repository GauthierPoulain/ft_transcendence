import useUser from "../../../../data/use-user"
import { Message as MessageType } from "../../../../data/messages"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { useAuth } from "../../../../data/use-auth"
import { useMemberByUser } from "../../../../data/members"
// import { Button, Card } from "react-bootstrap"
import "../style.scss"
import { useRelation, useRelations } from "../../../../data/relations"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useState } from "react"
import { useChannel } from "../../../../data/channels"
import DeleteButton from "./delete"

// function GameRequestCard({ author }) {
//     return (
//         <Card
//             style={{
//                 backgroundColor: "black",
//                 width: "20rem",
//                 borderRadius: "22px",
//             }}
//         >
//             <Card.Body className="game-card">
//                 <Card.Title className="mb-2">Game Request</Card.Title>
//                 <div className="author mb-2">
//                     {author.nickname} asking for a game !
//                 </div>
//                 <Button variant="warning" style={{ width: "100%" }}>
//                     Play
//                 </Button>
//             </Card.Body>
//         </Card>
//     )
// }

export default function Message({ message }: { message: MessageType }) {
    const auth = useAuth()
    const author = useUser(message.authorId)
    const channel = useChannel(message.channelId)!
    const self = useMemberByUser(auth.userId!)!
    const [show, setShow] = useState(false)
    const { isBlocking } = useRelation(author.id)

    // TODO: Deduplicate code for message
    if (isBlocking && !show) {
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
                            (self.role !== "guest" &&
                                channel.type !== "direct")) && (
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
