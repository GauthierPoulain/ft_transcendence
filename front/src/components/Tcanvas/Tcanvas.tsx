import pong from "./pong"
import "./tcanvas.css"
import React, { useEffect, useState } from "react"

import WebSocketService from "../../WebSocketService"

function Tcanvas(props: { width: number; height: number }) {
    const WSUrl = new URL(`ws://${document.location.hostname}:3005`)
    const [ws, setWs] = useState(new WebSocketService(WSUrl))

    const [message, setMessage] = useState([])

    useEffect(() => {
        //function called when component is mounted
        console.log("mount")
        //call draw function of pong obj

        ws.connect()

        ws.onMessage((e) => {
            console.log(e)
            setMessage(JSON.parse(e.data))
        })

        ws.onOpen((e) => {
            console.log("ws connected")
        })

        return () => {
            ws.onClose(() => {
                console.log("ws disconnected")
            })
            ws.close()
        }
    }, [ws.onMessage, ws.onOpen, ws.onClose])

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
