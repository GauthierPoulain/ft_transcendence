import { Outlet } from "react-router-dom"
import PongProvider from "./Provider"

export default function GameLayout() {
    return (
        <PongProvider>
            <Outlet />
        </PongProvider>
    )
}
