import React from "react";
import "../static/styles/navButton.css"

function NavButton(props:any) {
    return (
        <React.Fragment>
            <button id={props.id}>{props.children}</button>
        </React.Fragment>
    )
}

export default NavButton;