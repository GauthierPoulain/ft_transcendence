import React from "react";
import pong from "../../static/scripts/pong";
import "../../static/styles/pong.css"
import "./tcanvas.css"

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
