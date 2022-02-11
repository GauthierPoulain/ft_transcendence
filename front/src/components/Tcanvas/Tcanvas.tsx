import pong from "./pong"
import "./tcanvas.css"
import React, { useEffect } from "react"

function Tcanvas(props: any) {
    useEffect(() => {
        //function called when component is mounted
        console.log("mount")
        //call draw function of pong obj
    }, [])

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
