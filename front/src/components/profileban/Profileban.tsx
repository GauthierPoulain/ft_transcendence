import { Col, Container, Row } from "react-bootstrap"
import "./style.css"

export default function ChatBox(props: any) {
    return <div className="container-fluid profileBan">{props.children}</div>
}
