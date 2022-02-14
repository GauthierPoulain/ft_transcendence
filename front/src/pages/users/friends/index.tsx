import { Brightness1 } from "@material-ui/icons"
import { Image, Container } from "react-bootstrap"
import { Link } from "react-router-dom"

function Friend({ pic, user, status }) {
    return (
        <div className="d-flex border border-dark border-2 m-2">
            <Image src={pic} style={{ height: "4em", width: "4em" }} />
            <Link to="#" className="m-auto mx-3 fs-4 text-decoration-none">
                {user}
            </Link>
            <div className="m-auto d-flex">
                <span className="text-white text-uppercase m-auto">{ status }</span>
                <Brightness1 className="mx-2" style={{ color: status === "ONLINE" ? "lime" : "red" }} />
            </div>
        </div>
    )
}

export default function Friends() {
    return (
        <Container>
            <h2>Friends</h2>

            <div className="d-flex flex-wrap">
                <Friend
                    pic="/assets/42.jpg"
                    user="ldevilla"
                    status="ONLINE"
                />
                <Friend
                    pic="/assets/42.jpg"
                    user="pouet"
                    status="OFFLINE"
                />
                <Friend pic="/assets/42.jpg" user="pouic" status="ONLINE" />
            </div>
        </Container>
    )
}
