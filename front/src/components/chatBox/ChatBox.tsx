import Channels from "./Channels"
import { Outlet } from "react-router-dom"
import "./chatbox.css"

export default function ChatBox() {
    return (
        <div className="d-flex mt-3">
            <Channels />
            <Outlet />
        </div>
    )
}
