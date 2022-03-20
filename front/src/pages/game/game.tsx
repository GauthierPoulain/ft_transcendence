import Pong from "../../components/Pong/Pong"
import PongProvider from "./Provider"

export default function Game() {
    return (
        <PongProvider>
            <Pong />
        </PongProvider>
    )
}
