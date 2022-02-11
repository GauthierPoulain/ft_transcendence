import "./style.css"
import React, { Component } from "react"
import { Table } from "react-bootstrap"

class LeaderboardTab extends React.Component {
    state = {
        players: [
            { rank: "1", login: "arpascal", victories: "32" },
            { rank: "2", login: "ckurt", victories: "29" },
            { rank: "3", login: "gapoulai", victories: "12" },
            { rank: "4", login: "ldevilla", victories: "4" },
            //DB
            //Make button on players to redirect to their profile
        ],
    }

    add() {
        let player = this.state.players
        player.push({ rank: "?", login: "newPlayer", victories: "?" })
        this.setState(player)
    }

    render() {
        return (
            <div>
                <h1 className="leaderboardTitle">Leaderboard</h1>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#rank</th>
                            <th>Login</th>
                            <th>Victories</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.players.map((player) => (
                            <tr>
                                <td>{player.rank}</td>
                                <td>
                                    <img
                                        className="imgLead"
                                        src="/assets/42.jpg"
                                        alt=""
                                    />
                                    {player.login}
                                </td>
                                <td>{player.victories}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <button onClick={() => this.add()}>+</button>
            </div>
        )
    }
}

export default LeaderboardTab
