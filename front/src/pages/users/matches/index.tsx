import React from "react"
import { Container, Image, Table } from "react-bootstrap"
import { useParams } from "react-router-dom"
import UserAvatar from "../../../components/user/UserAvatar"
import { useMatches } from "../../../data/matches"
import { useUser } from "../../../data/users"

import "./styles.scss"

function GetRow({
    oponnent,
    winner,
    scoreYou,
    scoreOponnent,
}: {
    oponnent: number
    winner: number
    scoreYou: number
    scoreOponnent: number
}) {
    const userOponnent = useUser(oponnent)
    const userWin = useUser(winner)
    return (
        <tr>
            <td>
                <UserAvatar userId={userOponnent.id} className="w-16" />{" "}
                {userOponnent.nickname}
            </td>
            <td>
                <UserAvatar userId={userWin.id} className="w-16" />{" "}
                {userWin.nickname}
            </td>
            <td>{scoreYou}</td>
            <td>{scoreOponnent}</td>
        </tr>
    )
}

export default function Matches() {
    const { userId } = useParams()
    const user = useUser(parseInt(userId as string, 10))
    const matches = useMatches()

    return (
        <Container>
            <h2>Matches</h2>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Against</th>
                        <th>Winner</th>
                        <th>Your score</th>
                        <th>Opponent score</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((match) => {
                        if (
                            match.playerOneId != user.id &&
                            match.playerTwoId != user.id
                        )
                            return <React.Fragment />
                        if (
                            match.state != "player_one_won" &&
                            match.state != "player_two_won"
                        )
                            return <React.Fragment />

                        return (
                            <GetRow
                                key={match.id}
                                oponnent={
                                    match.playerOneId == user.id
                                        ? match.playerTwoId
                                        : match.playerOneId
                                }
                                winner={
                                    match.state == "player_one_won"
                                        ? match.playerOneId
                                        : match.playerTwoId
                                }
                                scoreYou={
                                    match.playerOneId == user.id
                                        ? match.scorePOne
                                        : match.scorePTwo
                                }
                                scoreOponnent={
                                    match.playerOneId == user.id
                                        ? match.scorePTwo
                                        : match.scorePOne
                                }
                            />
                        )
                    })}
                </tbody>
            </Table>
        </Container>
    )
}
