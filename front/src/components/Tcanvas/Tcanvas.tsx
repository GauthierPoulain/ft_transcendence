import pong from "./pong"
import "./tcanvas.css"
import React, { useEffect, useRef, useState } from "react"

class WebSocketService extends WebSocket {
    emit(event: string, data: any = null) {
        return this.send(JSON.stringify({ event: event, data: data }))
    }
}

function Tcanvas(props: any) {
    const WSUrl = new URL(`ws://${document.location.hostname}:3005`)
    const [ws, setWs] = useState(new WebSocketService(WSUrl))
    const [message, setMessage] = useState([])

    useEffect(() => {
        //function called when component is mounted
        console.log("mount")
        //call draw function of pong obj

        ws.onmessage = (e) => {
            setMessage(JSON.parse(e.data))
        }

        ws.onopen = () => {
            console.log("ws connected")
        }

        return () => {
            ws.onclose = () => {
                console.log("ws disconnected")
            }
        }
    }, [ws.onmessage, ws.onopen, ws.onclose])

    return (
        <React.Fragment>
            <canvas
                id="pong"
                width={props.width}
                height={props.height}
            ></canvas>
            {pong(props)}
        </React.Fragment>
    )
}

export default Tcanvas
