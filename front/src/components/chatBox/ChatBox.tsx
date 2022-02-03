import "./chat.css"
import React from "react";

class ChatBox extends React.Component {

    state = 
    {
        nb: 0,//TEST
        chat: [
            {str: "hey"},
            {str: "pouic"},
            {str: "lul"}
        ],
        chan:
        [
            {name: "#ldevilla"},
            {name: '#ckurt'},
            {name: '#gapoulai'},
            {name: '#arpascal'}
        ]
    };

    add()//TEST
    {
        let nbr = this.state.nb++;
        this.setState({nbr});
    }

    addChan()
    {
        let chanList = this.state.chan;
        chanList.push({name: "#newChan"});
        this.setState(chanList);
    }

    render()
    {
    return (
        <div className="chatContainer">
            <div className="chatleft">
                <div className="channels">
                    <span className="chattitle">Discussion</span><br /><br />
                    <div className="chan">
                        <span>channels</span>
                        <button id="addChan" onClick={() => this.addChan()}>+</button>
                    </div>
                    <div className="chanList">
                        {this.state.chan.map(msg => (
                            <div>
                                <span>{msg.name}</span> <br />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="chatcenter">
                <div className="chat">
                    <span className="chatname">#student's chat</span>
                    <div className="chatbox">
                        <button onClick={() => this.add()}>+</button>
                        <span>{this.state.nb}</span>
                        {this.state.chat.map(msg => (
                            <div>
                                <span>{msg.str}</span> <br />
                            </div>
                        ))}
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