import React from "react";
import pong from "./pong";
import "./pong.css"

function Tcanvas(props: any) {
    return (
        <React.Fragment>
            <canvas
                id="pong"
                width={props.width}
                height={props.height}
            ></canvas>
            {pong(props)}
        </React.Fragment>
    );
}

export default Tcanvas;
