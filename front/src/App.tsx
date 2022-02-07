// TODO: Check for lazy route component fetching

import Profile from "./pages/profile/Profile"
import Home from "./pages/home/Home"
import Leaderboard from "./pages/leaderboard/Leaderboard"
import { Page as Authentication } from "./pages/authentication"
import { Outlet, Route, Routes } from 'react-router-dom'
import Topbar from "./components/topbar/Topbar"
import ChatBox from "./components/chatBox/ChatBox"
import RoomView from "./components/chatBox/RoomView"
import ChannelCreate from "./pages/channels/ChannelCreate"

function Layout() {
	return (
		<>
			<Topbar />
			<Outlet />
		</>
	)

}

export default function App() {
    return (
        <Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="chat" element={<ChatBox />}>
					<Route index element={<div>Join a channel</div>} />
					<Route path="create" element={<ChannelCreate />} />
					<Route path="room/:channelId" element={<RoomView />} />
				</Route>
				<Route path="leaderboard" element={<Leaderboard />} />
				<Route path="profile" element={<Profile />} >
					
				</Route>
				<Route path="auth" element={<Authentication/>} />
			</Route>
        </Routes>
    );
}
