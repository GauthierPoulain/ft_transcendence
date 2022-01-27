import React, { Fragment } from "react";
import "./App.css";
import Tcanvas from "./Tcanvas";

function pong() {
    console.log("saliut");
}

function App() {
    return (
        <Fragment>
            {pong()}
            <Tcanvas width="1000px" height="500px"></Tcanvas>
        </Fragment>
    );
}

export default App;
