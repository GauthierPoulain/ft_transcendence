import "./chat.css"
import { Link } from 'react-router-dom'
import { Home } from '@material-ui/icons'
import { Person } from '@material-ui/icons'


function ChatBox(props:any) {
    return (
        <div className="chatContainer">
            <div className="chatleft">
                <div className="channels">
                    <span className="chattitle">Channels</span>
                </div>
            </div>

            <div className="chatcenter">
                <div className="chat">
                    <span className="chattitle">Chat</span>
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

export default ChatBox;