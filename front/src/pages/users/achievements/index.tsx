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
                    desc="win your first match"
                    logo="/assets/achievements-bronze.png"
                />
                <Achievement
                    title="pong challenger"
                    desc="win 5 matches"
                    logo="/assets/achievements-silver.png"
                />
                <Achievement
                    title="pong master"
                    desc="win 20 matches"
                    logo="/assets/achievements-gold.png"
                />
            </div>
        </Container>
    )
}
