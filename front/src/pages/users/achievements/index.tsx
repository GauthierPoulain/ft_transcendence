import { Container, Image } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useUser } from "../../../data/users"
import "./achievements.scss"

const logos = [
    "/assets/achievements-bronze.png",
    "/assets/achievements-silver.png",
    "/assets/achievements-gold.png",
]

const achievements = [
    {
        name: "win_one_match",
        title: "Pong rookie",
        description: "Win your first match",
        level: 2,
    },
    {
        name: "channel_join",
        title: "Speaker",
        description: "Join your first channel",
        level: 0,
    },
    {
        name: "channel_create",
        title: "Owner",
        description: "Create your first channel",
        level: 1,
    },
    {
        name: "follow_someone",
        title: "Hey my friend!",
        description: "Follow your first friend",
        level: 0,
    },
    {
        name: "block_someone",
        title: "Block someone!",
        description: "Block someone",
        level: 0,
    },
]

function Achievement({ title, desc, logo, unlocked }) {
    return (
        <div
            className={`d-flex border border-dark border-2 m-2 p-2 achievements-card ${
                unlocked ? "bg-dark" : ""
            }`}
        >
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
    const params = useParams()
    const userId = parseInt(params.userId as string, 10)
    const user = useUser(userId)!

    return (
        <Container>
            <h2>Achievements</h2>
            <div className="d-flex flex-wrap">
                {achievements.map(({ name, title, description, level }) => (
                    <Achievement
                        key={name}
                        title={title}
                        desc={description}
                        logo={logos[level]}
                        unlocked={user.achievements[name]}
                    />
                ))}
            </div>
        </Container>
    )
}
