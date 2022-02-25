import Topbar from "../../components/topbar/Topbar"
import Pong from "../../components/Pong/Pong"
import React from "react"
import { Link } from "react-router-dom"
import "./home.scss"
import { Button } from "react-bootstrap"

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
        </React.Fragment>
    )
}

export default Home
