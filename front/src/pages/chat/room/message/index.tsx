import useUser from "../../../../data/use-user"
import { Message as MessageType } from "../../../../data/messages"
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useAuth } from "../../../../data/use-auth"
import { useMemberByUser } from "../../../../data/members"
import "../style.scss"
import { useRelation } from "../../../../data/relations"
import VisibilityIcon from "@mui/icons-material/Visibility"
import { useState } from "react"
import { useChannel } from "../../../../data/channels"
import DeleteButton from "./delete"
import { useMatch } from "../../../../data/matches"
import { Link } from "react-router-dom"

function KnownGameCard({ game }) {
    const playerOne = useUser(game.playerOneId)!
    const playerTwo = useUser(game.playerTwoId)!

    return (
        <Card className="bg-dark">
            <Card.Body>
                <Card.Title className="mb-2">Game #{game.id}</Card.Title>
                <div className="mb-2">
                    {playerOne.nickname} vs {playerTwo.nickname}
                </div>
                <Link
                    to={`/game/${game.id}`}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                >
                    Go to the game
                </Link>
            </Card.Body>
        </Card>
    )
}

function GameCard({ gameId }) {
    const game = useMatch(gameId)

    if (!game) {
        return (
            <Card className="bg-dark">
                <Card.Body>
                    <Card.Title className="mb-2">Game #{gameId}</Card.Title>
                    <div className="mb-2">Game not found!</div>
                </Card.Body>
            </Card>
        )
    }

    return <KnownGameCard game={game} />
}

function MessageContent({ content }) {
    const match = content.match(/^#game:(\d+)#$/)

    if (!match) {
        return <div>{content}</div>
    }

    const number = parseInt(match[1], 10)

    return <GameCard gameId={number} />
}

export default function Message({ message }: { message: MessageType }) {
    const auth = useAuth()
    const author = useUser(message.authorId)!
    const channel = useChannel(message.channelId)!
    const self = useMemberByUser(auth.userId!)!
    const [show, setShow] = useState(false)
    const { isBlocking } = useRelation(author.id)

    const hidden = isBlocking && !show

    return (
        <div className="d-flex flex-column">
            <div className="d-flex justify-content-start align-items-center gap-x-2">
                {hidden ? (
                    <span className="fst-italic text-secondary">
                        Blocked message
                    </span>
                ) : (
                    <span className="user-tag">{author.nickname}</span>
                )}
                {hidden && (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Show</Tooltip>}
                    >
                        <VisibilityIcon
                            className="text-secondary cursor-pointer"
                            fontSize="inherit"
                            onMouseDown={() => setShow(true)}
                        />
                    </OverlayTrigger>
                )}
                {(self.userId === author.id ||
                    (self.role !== "guest" && channel.type !== "direct")) && (
                    <DeleteButton message={message} />
                )}
            </div>

            {!hidden && <MessageContent content={message.content} />}
        </div>
    )
}

//<GameRequestCard author={author}/>
