import React from "react";
import "../static/styles/button.css"

var done = false;

function test() {
    console.log("hop clicked");
    if (done)
    {
        var toDel = document.getElementById("sub");
        toDel?.remove();
        done = false;
        return ;
    }
    var tag = document.createElement("p");
    tag.setAttribute("id", "sub");
    var text = document.createTextNode("C'est génial ici!");
    tag.appendChild(text);
    var element = document.getElementById('test');
    element?.appendChild(tag);
    done = true;
}

function Cbutton(props: any) {
    return (
        <React.Fragment>
            <button id="test" onClick={test}>{props.children}</button>
        </React.Fragment>
    );
}

export default Cbutton;