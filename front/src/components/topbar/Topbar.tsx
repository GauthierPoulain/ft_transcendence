import "./topbar.css"
import { Link } from 'react-router-dom'
import { Home } from '@material-ui/icons'
import { Person } from '@material-ui/icons'
import { useSelector } from "react-redux"
import { currentUser } from "../../services/auth"

function ProfilePic() {
	const user = useSelector(currentUser)
	const src = user ? user.intra_image_url : "/assets/42.jpg"

    return <img src={src} className="topbarImg" />
}

export default function Topbar() {
    return <div className="topbarContainer">
		<div className="topbarLeft">
		<Link to="/" className="logo">
			<span className="logo">ft_pong</span>
		</Link>
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
			<ProfilePic />
		</div>
	</div>
}
