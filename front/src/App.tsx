// TODO: Check for lazy route component fetching

import Profile from "./pages/profile/Profile"
import Home from "./pages/home/Home"
import Leaderboard from "./pages/leaderboard/Leaderboard"
import { Page as Authentication } from "./pages/authentication"
import { Outlet, Route, Routes } from 'react-router-dom'
import Topbar from "./components/topbar/Topbar"
import ChatBox from "./components/chatBox/ChatBox"
import RoomView from "./components/chatBox/RoomView"
import ChatJoin from "./components/chatBox/ChatJoin"
import ChannelCreate from "./pages/channels/ChannelCreate"
import Matches from './components/profileban/Matches'
import Achievements from './components/profileban/Achievements'
import Friends from './components/profileban/Friends'
import ProfileSettings from './components/profileban/ProfileSettings'
import useWebSocket from "react-use-websocket"

function Layout() {
	return (
		<>
			<Topbar />
			<Outlet />
		</>
	)

}

function Router() {
    return (
        <Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="chat" element={<ChatBox />}>
					<Route index element={<ChatJoin />} />
					<Route path="create" element={<ChannelCreate />} />
					<Route path="room/:channelId" element={<RoomView />} />
				</Route>
				<Route path="leaderboard" element={<Leaderboard />} />
				<Route path="profile" element={<Profile />} >
					<Route index element={<Matches />} />
					<Route path="matches" element={< Matches/>} />
					<Route path="achievements" element={< Achievements/>} />
					<Route path="friends" element={< Friends/>} />
					<Route path="settings" element={< ProfileSettings/>} />
				</Route>
				<Route path="auth" element={<Authentication/>} />
			</Route>
        </Routes>
    );
}

export default function App() {
	return <Router />
}
