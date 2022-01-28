import React from "react";
import "../static/styles/button.css"

var done = false;

function createElem(event:any) {
    var tag = document.createElement("img");
    tag.setAttribute("id", "sub");
    tag.src = "https://files.neryss.pw/random/cat.gif";
    tag.style.position = "absolute";
    tag.style.top = event.pageY + "px";
    tag.style.left = event.pageX + "px";
    tag.style.transform = "translate(20%, -120%)";
    tag.style.pointerEvents = "none";
    console.log(tag.style.top);
    console.log(event.pageX);
    tag.style.position = 'absolute';
    var text = document.createTextNode("C'est génial ici!");
    tag.appendChild(text);
    return (tag)
}

function test(event:any, id:any) {
    if (any == "test")
    if (done)
    {
        var toDel = document.getElementById("sub");
        toDel?.remove();
        done = false;
        return ;
    }
    var tag = createElem(event);
    var element = document.getElementById('root');
    element?.appendChild(tag);
    done = true;
}

class Cbutton extends React.Component {
    constructor(props:any) {
        super(props);
    }
    render() {
        return (
            <React.Fragment>
                <button id={this.props.} onClick={test, this.}>{this.props.children}</button>
            </React.Fragment>
        );
    }
}

// function Cbutton(props: any) {
//     return (
//         <React.Fragment>
//             <button id="test" onClick={test}>{props.children}</button>
//         </React.Fragment>
//     );
// }

export default Cbutton;