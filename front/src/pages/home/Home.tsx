import Topbar from "../../components/topbar/Topbar"
import Pong from "../../components/Pong/Pong"
import React from "react"
import { Link } from "react-router-dom"
import "./home.scss"
import { Button, Table, OverlayTrigger, Tooltip } from "react-bootstrap"
import { Visibility } from "@material-ui/icons"

function RunningMatches()
{
    return (
		<>
		<h1 className="mb-2 ms-2 game-title">Matches in progress</h1>
		<Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    <th>Player1</th>
                    <th>Player2</th>
                    <th></th>
                </tr>
            </thead>
			<tbody>
				<tr>
					<td>Pouic</td>
					<td>Pouet</td>
					<td>
						<OverlayTrigger placement="right" overlay={<Tooltip>View Match</Tooltip>}>
							<Visibility className="game-view"/>
						</OverlayTrigger>
					</td>
				</tr>
				<tr>
					<td>Pouic</td>
					<td>Pouet</td>
					<td>
						<OverlayTrigger placement="right" overlay={<Tooltip>View Match</Tooltip>}>
							<Visibility className="game-view"/>
						</OverlayTrigger>
					</td>
				</tr>
				<tr>
					<td>Pouic</td>
					<td>Pouet</td>
					<td>
						<OverlayTrigger placement="right" overlay={<Tooltip>View Match</Tooltip>}>
							<Visibility className="game-view"/>
						</OverlayTrigger>
					</td>
				</tr>
				<tr>
					<td>Pouic</td>
					<td>Pouet</td>
					<td>
						<OverlayTrigger placement="right" overlay={<Tooltip>View Match</Tooltip>}>
							<Visibility className="game-view"/>
						</OverlayTrigger>
					</td>
				</tr>
			</tbody>
        </Table>
		</>
    )
}

function Home() {
    return (
        <React.Fragment>
            <div className="container-fluid welcome-bar">
                <div className="text-center my-5">
                    <h1>Welcome to ft_pong</h1>
                    <p className="desc">Let's play a pong match !</p>
                    <img src="/assets/pong.png" className="w-25" alt="" />
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <Button className="play-button p-2" size="lg" variant="warning">
                    <Link className="text" to="/game">
                        PLAY
                    </Link>
                </Button>
            </div>
			<div className="mt-5">
            	<RunningMatches />
			</div>
        </React.Fragment>
    )
}

export default Home
