import "./chat.css"
import React from "react";

class ChatBox extends React.Component {

    state = 
    {
        nb: 0
    };

    add()
    {
        let nbr = this.state.nb++;
        this.setState({nbr});
    }

    render()
    {
    return (
        <div className="chatContainer">
            <div className="chatleft">
                <div className="channels">
                    <span className="chattitle">Channels</span>
                </div>
            </div>

            <div className="chatcenter">
                <div className="chat">
                    <span className="chatname">#student's chat</span>
                    <div className="chatbox">
                        <button onClick={() => this.add()}>+</button>
                        <span>{this.state.nb}</span>
                    </div>
                    <input type="text" placeholder="type something..." className="inputHolder"/>
                </div>
            </div>

            <div className="chatright">
                <div className="friendschat">
                    <span className="chattitle">Friends</span>
                </div>
            </div>
        </div>
    )
    }
}

export default ChatBox;