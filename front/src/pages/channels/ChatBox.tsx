import Channels from "../../pages/channels/channels-list/Channels"
import { Outlet } from "react-router-dom"

export default function ChatBox() {
    return (
        <div className="d-flex mt-3">
            <Channels />
            <Outlet />
        </div>
    )
}
