import "./topbar.css"
import { Link } from 'react-router-dom'
import { Home } from '@material-ui/icons'
import { Person } from '@material-ui/icons'


function Topbar(props:any) {
    return (
        <div className="topbarContainer">
			<div className="topbarLeft">
                <span className="logo">ft_pong</span>
            </div>

            <div className="topbarCenter">
                <div className="topbarLinks">
                    <Link to="/leaderboard" className="links">
                        <span>Leaderboard</span>
                    </Link>
                    <Link to="/chat" className="links">
                        <span>Chat</span>
                    </Link>
                </div>
            </div>

            <div className="topbarRight">
                <div className="topbarLinks">
                    <Link to="/" className="links">
                        <Home />
                    </Link>
                    <Link to="/profile" className="links">
                        <Person />
                    </Link>
                </div>
                <img src="/assets/42.jpg" alt="" className="topbarImg" />
            </div>
        </div>
    )
}

export default Topbar;