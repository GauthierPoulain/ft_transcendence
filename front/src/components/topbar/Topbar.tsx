import "./topbar.css"
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'


function Topbar(props:any) {
    return (
        <div className="topbarContainer">
			<div className="topbarLeft">
                <span className="logo">ft_pong</span>
            </div>

            <div className="topbarCenter"></div>

            <div className="topbarRight">
                <div className="topbarLinks">
                    <Link to="/" className="links">
                        <span className="topbarLink">Homepage</span>
                    </Link>
                    <Link to="/profile" className="links">
                        <span className="topbarLink">Profile</span>
                    </Link>
                </div>
                <img src="/assets/42.jpg" alt="" className="topbarImg" />
            </div>
        </div>
    )
}

export default Topbar;