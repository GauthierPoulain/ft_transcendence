import "./style.css"
import React from "react"
import { Table } from "react-bootstrap"
import { useUser } from "../../data/users"
import { Match, useMatches } from "../../data/matches"
import UserAvatar from "../user/UserAvatar"

interface Player {
    id: number
    rank: number
    victories: number
}

function formatTable(matches: Match[]) {
    const res = new Map<number, Player>()

    matches.forEach((match) => {
        const p1 = match.playerOneId
        const p2 = match.playerTwoId
        if (!res.get(p1)) res.set(p1, { id: p1, rank: -1, victories: 0 })
        if (!res.get(p2)) res.set(p2, { id: p2, rank: -1, victories: 0 })
        const winner =
            match.state === "player_one_won"
                ? p1
                : match.state === "player_two_won"
                ? p2
                : undefined
        if (winner) {
            const currentData = res.get(winner)
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

function LeaderBoardComponent({ player }: { player: Player }) {
    const user = useUser(player.id)!

    return (
        <tr>
            <td>{player.rank}</td>
            <td>
                <UserAvatar userId={user.id} className="w-8 h-8 me-2" />
                {user.nickname}
            </td>
            <td>{player.victories}</td>
        </tr>
    )
}

function LeaderboardTab() {
    const matches = useMatches()
    const players = formatTable(matches)

    return (
        <div>
            <h1 className="my-4 title-leaderboard">Leaderboard</h1>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>#rank</th>
                        <th>Login</th>
                        <th>Victories</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player) => (
                        <LeaderBoardComponent key={player.id} player={player} />
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default LeaderboardTab
