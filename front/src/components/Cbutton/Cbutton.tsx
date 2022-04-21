import React from "react"
import ReactDOM from "react-dom"
import Mprofile from "../MiniProfile/MiniProfile"
import "../static/styles/button.css"

var done = false

function addReactElem(event: any) {
    var style = { position: "absolute", top: event.pageY, left: event.pageX }
    var props = { myid: "mprofile-container" }
    const element = React.createElement(Mprofile, props)
    ReactDOM.render(element, document.getElementById("menu"))
}

function createElem(event: any) {
    var tag = document.createElement("img")
    tag.setAttribute("id", "sub")
    tag.src = "https://files.neryss.pw/random/cat.gif"
    tag.style.position = "absolute"
    tag.style.top = event.pageY + "px"
    tag.style.left = event.pageX + "px"
    tag.style.transform = "translate(20%, -120%)"
    tag.style.pointerEvents = "none"
    // tag.style.color = "red";
    console.log(tag.style.top)
    console.log(event.pageX)
    tag.style.position = "absolute"
    var text = document.createTextNode("C'est génial ici!")
    tag.appendChild(text)
    return tag
}

function test(event: any, id: any) {
    if (id != "menu") return
    if (done) {
        var toDel = document.getElementById("sub")
        toDel?.remove()
        done = false
        return
    }
    var tag = addReactElem(event)
    var element = document.getElementById("root")
    // element?.appendChild(tag);
    done = true
}

function Cbutton(props: any) {
    return (
        <button id={props.id} onClick={(event) => test(event, props.id)}>
            {props.children}
        </button>
    )
}

export default Cbutton
