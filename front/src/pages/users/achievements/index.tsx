import { Container, Image } from "react-bootstrap"
import "./achievements.scss"

function Achievement({ title, desc, logo }) {
    return (
        <div className="d-flex border border-dark border-2 m-2 p-2 achievements-card">
            <Image
                src={logo}
                className="img"
                style={{ height: "4em", width: "4em" }}
            />

            <div className="m-auto mx-4">
                <span className="text-uppercase m-auto title">{title}</span>{" "}
                <br />
                <span className="m-auto desc">{desc}</span>
            </div>
        </div>
    )
}

export default function Achivements() {
    return (
        <Container>
            <h2>Achievements</h2>
            <div className="d-flex flex-wrap">
                <Achievement
                    title="pong rookie"
                    desc="Win your first match"
                    logo="/assets/achievements-bronze.png"
                />
                <Achievement
                    title="pong challenger"
                    desc="Win 5 matches"
                    logo="/assets/achievements-silver.png"
                />
                <Achievement
                    title="pong master"
                    desc="Win 20 matches"
                    logo="/assets/achievements-gold.png"
                />
                <Achievement
                    title="Speaker"
                    desc="Join a channel"
                    logo="/assets/achievements-bronze.png"
                />
                <Achievement
                    title="Owner"
                    desc="Create a channel"
                    logo="/assets/achievements-silver.png"
                />
                <Achievement
                    title="Hey my friend !"
                    desc="Follow your first friend"
                    logo="/assets/achievements-bronze.png"
                />
                <Achievement
                    title="Relationship !"
                    desc="Follow 5 persons"
                    logo="/assets/achievements-silver.png"
                />
                <Achievement
                    title="Top 1"
                    desc="You are the best player"
                    logo="/assets/achievements-gold.png"
                />
                <Achievement
                    title="I'm your father"
                    desc="Perfect a game match"
                    logo="/assets/achievements-gold.png"
                />
                <Achievement
                    title="My name is..."
                    desc="Change your nickname"
                    logo="/assets/achievements-bronze.png"
                />
                <Achievement
                    title="Better than that"
                    desc="Change your PP"
                    logo="/assets/achievements-bronze.png"
                />
            </div>
        </Container>
    )
}
