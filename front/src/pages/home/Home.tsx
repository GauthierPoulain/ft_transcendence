import React from "react"
import { Link } from "react-router-dom"
import { Button, Container } from "react-bootstrap"
import "./home.scss"
import { useAuth } from "../../data/use-auth"
import SectionFriends from "./friends"
import SectionMatches from "./matches"

export default function Home() {
    const auth = useAuth()

    return (
        <div>
            <Container>
                <div className="welcome-bar">
                    <div className="text-center my-5">
                        <h1>Welcome to ft_pong</h1>
                        <p className="desc">Let's play a pong match !</p>
                        <img
                            src="/assets/pong.png"
                            className="w-25 img"
                            alt=""
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Link to="/game/matchmaking">
                        <Button
                            className="play-button p-2"
                            size="lg"
                            variant="warning"
                        >
                            <p>JVEU GAME</p>
                        </Button>
                    </Link>
                </div>
                {auth.connected && <SectionFriends />}
                <SectionMatches />
            </Container>
        </div>
    )
}
