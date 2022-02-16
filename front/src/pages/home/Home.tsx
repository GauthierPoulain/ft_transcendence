import Topbar from "../../components/topbar/Topbar"
import Pong from "../../components/Pong/Pong"
import React from "react"
import { Link } from "react-router-dom"

function Home() {
    return (
        <React.Fragment>
            <h1>uwu</h1>
			<Link className="nav-link" to="/game">pour les g@m3rz</Link>
        </React.Fragment>
    )
}

export default Home
