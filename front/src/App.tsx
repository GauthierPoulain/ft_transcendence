// TODO: Check for lazy route component fetching

import Profile from "./pages/profile/Profile"
import Home from "./pages/home/Home"
import Leaderboard from "./pages/leaderboard/Leaderboard"
import { Page as Authentication } from "./pages/authentication"
import { Outlet, Route, Routes, Navigate } from 'react-router-dom'
import Topbar from "./components/topbar/Topbar"
import ChatBox from "./components/chatBox/ChatBox"
import RoomView from "./components/chatBox/RoomView"
import ChatJoin from "./components/chatBox/ChatJoin"
import ChannelCreate from "./pages/channels/ChannelCreate"
import Matches from './components/profileban/Matches'
import Achievements from './components/profileban/Achievements'
import Friends from './components/profileban/Friends'
import ProfileSettings from './components/profileban/ProfileSettings'
import Users from "./pages/users/Users"
import { useAuth } from "./auth"

function Layout() {
	return (
		<>
			<Topbar />
			<Outlet />
		</>
	)

}

function PrivateRoute(props:any)
{
	const auth = useAuth();

	if (!auth.connected)
	{
		return (
			<Navigate to="/auth" />
		)
	}

	return (
		<>
			{props.children}
		</>
	)
}

function Router() {

	const auth = useAuth();

    return (
        <Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="chat" element={<PrivateRoute><ChatBox /></PrivateRoute>}>
					<Route index element={<ChatJoin />} />
					<Route path="create" element={<ChannelCreate />} />
					<Route path="room/:channelId" element={<RoomView />} />
				</Route>
				<Route path="leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
				<Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} >
					<Route index element={<Matches />} />
					<Route path="matches" element={< Matches/>} />
					<Route path="achievements" element={< Achievements/>} />
					<Route path="friends" element={< Friends/>} />
					<Route path="settings" element={< ProfileSettings/>} />
				</Route>
				<Route path="/users/:id" element={<PrivateRoute><Users /></PrivateRoute>}/>
				<Route path="auth" element={<Authentication/>} />
				<Route path="*" element={<Navigate to="/"/>} />
			</Route>
        </Routes>
    );
}

export default function App() {
	return <Router />
}
