import React from "react"
import { Link } from "react-router-dom"
import { Button, Container } from "react-bootstrap"
import "./home.scss"
import { useAuth } from "../../data/use-auth"
import SectionFriends from "./friends"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import SectionMatches from "./matches"
import { Engine } from "tsparticles-engine"

function Animation(props: any) {
    const particlesInit = async (main: Engine) => {
        await loadFull(main)
    }

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                background: {
                    color: {
                        value: "",
                    },
                },
                fpsLimit: 144,
                interactivity: {
                    detect_on: "window",
                    events: {
                        resize: true,
                    },
                },
                fullScreen: {
                    enable: true,
                    zIndex: -1,
                },
                particles: {
                    color: {
                        value: "#999999",
                    },
                    links: {
                        color: "#999999",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    collisions: {
                        enable: false,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 3,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: true,
            }}
        />
    )
}

export default function Home() {
    const auth = useAuth()

    return (
        <div>
            { /* Temporary disabled due to annoying lag before switching to home page. */ }
            { /* <Animation /> */ }
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
