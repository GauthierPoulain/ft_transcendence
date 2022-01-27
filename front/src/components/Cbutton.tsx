import React from "react";
import "../static/styles/button.css"

function Cbutton(props: any) {
    return (
        <React.Fragment>
            <button>{props.children}</button>
        </React.Fragment>
    );
}

export default Cbutton;