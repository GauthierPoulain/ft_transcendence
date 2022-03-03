import React from "react"
import { Link } from "react-router-dom"
import { Button, Table, OverlayTrigger, Tooltip, Container } from "react-bootstrap"
import "./home.scss"
import { useAuth } from "../../data/use-auth"
import SectionFriends from "./friends"
import { Visibility } from "@mui/icons-material"

function RunningMatches() {
    return (
        <>
            <h1 className="mb-2 ms-2 game-title">Matches in progress</h1>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Player1</th>
                        <th>Player2</th>
                        <th>Score</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <img
                                className="player-logo me-4"
                                src="/assets/42.jpg"
                                alt=""
                            />
                            Pouic
                        </td>
                        <td>
                            <img
                                className="player-logo me-4"
                                src="/assets/42.jpg"
                                alt=""
                            />
                            Pouet
                        </td>
                        <td>4 - 2</td>
                        <td>
                            <OverlayTrigger
                                placement="right"
                                overlay={<Tooltip>View Match</Tooltip>}
                            >
                                <Visibility className="game-view" />
                            </OverlayTrigger>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <img
                                className="player-logo me-4"
                                src="/assets/42.jpg"
                                alt=""
                            />
                            Pouic
                        </td>
                        <td>
                            <img
                                className="player-logo me-4"
                                src="/assets/42.jpg"
                                alt=""
                            />
                            Pouet
                        </td>
                        <td>4 - 2</td>
                        <td>
                            <OverlayTrigger
                                placement="right"
                                overlay={<Tooltip>View Match</Tooltip>}
                            >
                                <Visibility className="game-view" />
                            </OverlayTrigger>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </>
    )
}

function Home() {
    const auth = useAuth();

    return (
        <React.Fragment>
            <div className="container-fluid welcome-bar">
                <div className="text-center my-5">
                    <h1>Welcome to ft_pong</h1>
                    <p className="desc">Let's play a pong match !</p>
                    <img src="/assets/pong.png" className="w-25 img" alt="" />
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <Link to="/game">
                    <Button
                        className="play-button p-2"
                        size="lg"
                        variant="warning"
                    >
                        <p>JVEU GAME</p>
                    </Button>
                </Link>
            </div>
            { auth.connected && <SectionFriends /> }
            <Container>
                <RunningMatches />
            </Container>
        </React.Fragment>
    )
}

export default Home
