import { Outlet, useNavigate, useParams } from "react-router-dom"
import useUser from "../../data/use-user"
import { User } from "../../data/users"
import { useAuth } from "../../data/use-auth"
import UserAvatar from "../../components/user/UserAvatar"
import {
    Brightness1,
    Edit,
    Message,
    PersonAdd,
    PersonAddDisabled,
    RemoveCircle,
    RemoveCircleOutline,
} from "@mui/icons-material"
import { statusColor, statusText, useStatus } from "../../data/status"
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useRelation } from "../../data/relations"
import { Match, useMatches } from "../../data/matches"
import { ErrorBox } from "../../components/error/ErrorBox"
import { HttpError } from "../../errors/HttpError"
import { NavLink } from "react-router-dom"
import { activeClassName } from "../../utils/active-class-name"
import { useMutateDirectChannel } from "../../data/channels"
import { RestrictAuthenticated } from "../../components/auth"

function BlockButton({ userId }) {
    const { isBlocking, block, unblock } = useRelation(userId)
    const { submit, isLoading } = isBlocking ? unblock : block

    return (
        <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{isBlocking ? "Unblock" : "Block"}</Tooltip>}
        >
            <Button
                variant={isBlocking ? "secondary" : "dark"}
                size="sm"
                onClick={submit}
                disabled={isLoading}
            >
                {isBlocking ? <RemoveCircleOutline /> : <RemoveCircle />}
            </Button>
        </OverlayTrigger>
    )
}

function FriendButton({ userId }) {
    const { isFriendWith, friend, unfriend } = useRelation(userId)
    const { submit, isLoading } = isFriendWith ? unfriend : friend

    return (
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip>
                    {isFriendWith ? "Remove friend" : "Add friend"}
                </Tooltip>
            }
        >
            <Button
                variant={isFriendWith ? "danger" : "success"}
                size="sm"
                onClick={submit}
                disabled={isLoading}
            >
                {isFriendWith ? <PersonAddDisabled /> : <PersonAdd />}
            </Button>
        </OverlayTrigger>
    )
}

function DirectMessagButton({ userId }) {
    const navigate = useNavigate()
    const { submit, isLoading } = useMutateDirectChannel()

    async function directMessage() {
        const channel = await submit(userId)

        navigate(`/chat/room/${channel.id}`)
    }

    return (
        <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Direct message</Tooltip>}
        >
            <Button
                variant="dark"
                size="sm"
                onClick={directMessage}
                disabled={isLoading}
            >
                <Message />
            </Button>
        </OverlayTrigger>
    )
}

interface Player {
    id: number
    rank: number
    victories: number
    losses: number
}

function formatTable(matches: Match[]) {
    const res = new Map<number, Player>()

    matches.forEach((match) => {
        const p1 = match.playerOneId
        const p2 = match.playerTwoId
        if (!res.get(p1))
            res.set(p1, { id: p1, rank: -1, victories: 0, losses: 0 })
        if (!res.get(p2))
            res.set(p2, { id: p2, rank: -1, victories: 0, losses: 0 })
        const winner =
            match.state === "player_one_won"
                ? p1
                : match.state === "player_two_won"
                ? p2
                : undefined
        if (winner) {
            const currentData = res.get(winner)
            res.get(p1 === winner ? p2 : p1)!.losses++
            currentData!.victories++
            res.set(winner, currentData!)
        }
    })
    const final = Array.from(res.values())
    final.sort((a, b) => {
        if (a.victories > b.victories) return -1
        else if (a.victories < b.victories) return 1
        else return 0
    })
    for (let index = 0; index < final.length; index++)
        final[index].rank = index + 1
    return final
}

function getRank(player: Player[], user: User) {
    for (let index = 0; index < player.length; index++) {
        const current = player[index]
        if (current.id === user.id) return "#" + current.rank
    }
    return "unranked"
}

function getWins(player: Player[], user: User) {
    for (let index = 0; index < player.length; index++) {
        const current = player[index]
        if (current.id === user.id) return current.victories
    }
    return 0
}

function getLosses(player: Player[], user: User) {
    for (let index = 0; index < player.length; index++) {
        const current = player[index]
        if (current.id === user.id) return current.losses
    }
    return 0
}

function Banner({ userId }) {
    const user = useUser(userId)!
    const auth = useAuth()
    const players = formatTable(useMatches())

    const status = useStatus(user.id)
    const isCurrentUser = auth.connected && auth.userId === userId

    return (
        <div
            className="d-flex justify-content-center align-items-center flex-wrap"
            style={{ backgroundColor: "#1a1e21" }}
        >
            <div className="d-flex flex-column justify-content-center align-items-center m-3">
                <UserAvatar userId={user.id} className="w-32" />
                <p className="mb-0 fw-bold fs-5">{user.nickname}</p>
            </div>

            <div className="d-flex flex-grow-1 justify-content-evenly flex-wrap">
                <p className="fs-3 m-2">
                    Victories:{" "}
                    <span style={{ color: "lawngreen" }}>
                        {getWins(players, user)}
                    </span>
                </p>
                <p className="fs-3 m-2">
                    Losses:{" "}
                    <span style={{ color: "red" }}>
                        {getLosses(players, user)}
                    </span>
                </p>
                <p className="fs-3 m-2">
                    Rank:{" "}
                    <span style={{ color: "darkgrey" }}>
                        {getRank(players, user)}
                    </span>
                </p>
            </div>
            <RestrictAuthenticated>
                {!isCurrentUser && (
                    <div className="btn-group" role="group">
                        <FriendButton userId={user.id} />
                        <BlockButton userId={user.id} />
                        <DirectMessagButton userId={user.id} />
                    </div>
                )}
            </RestrictAuthenticated>
            <p className="text-uppercase m-3 my-1">
                {statusText(status)}
                <Brightness1
                    className="mx-2 mb-1"
                    style={{ color: statusColor(status) }}
                />
            </p>
        </div>
    )
}

function Navigation({ userId }) {
    const auth = useAuth()
    const isCurrentUser = auth.connected && auth.userId === userId

    return (
        <div className="btn-group mb-3">
            <NavLink
                to="matches"
                className={activeClassName("btn btn-dark btn-lg rounded-0")}
                replace
            >
                Matches
            </NavLink>
            <NavLink
                to="achievements"
                className={activeClassName("btn btn-dark btn-lg rounded-0")}
                replace
            >
                Achievements
            </NavLink>
            {isCurrentUser && (
                <>
                    <NavLink
                        to="relations"
                        className={activeClassName(
                            "btn btn-dark btn-lg rounded-0"
                        )}
                        replace
                    >
                        Relations
                    </NavLink>
                    <NavLink
                        to="settings"
                        className={activeClassName(
                            "btn btn-warning btn-lg rounded-0"
                        )}
                        replace
                    >
                        <Edit />
                    </NavLink>
                </>
            )}
            {!isCurrentUser && auth.connected && (
                <NavLink
                    to="challenge"
                    className={activeClassName("btn btn-dark btn-lg rounded-0")}
                    replace
                >
                    Challenge
                </NavLink>
            )}
        </div>
    )
}

export default function Users() {
    const params = useParams()
    const userId = parseInt(params.userId as string, 10)
    const user = useUser(userId)

    if (!user) {
        return <ErrorBox error={new HttpError(404)} />
    }

    return (
        <>
            <Banner userId={user.id} />
            <Navigation userId={user.id} />
            <Outlet />
        </>
    )
}
