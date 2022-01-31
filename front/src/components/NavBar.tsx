import React from "react";
import "../static/styles/navButton.css"

function NavButton(props:any) {
    return (
        <React.Fragment>
            <div id={props.myid}>
                <button id="navbutton">Chat</button>
                <button id="navbutton">Leaderboard</button>
                <button id="navbutton">Friend List</button>
            </div>
        </React.Fragment>
    )
}

export default NavButton;