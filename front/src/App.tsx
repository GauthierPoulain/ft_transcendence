// TODO: Check for lazy route component fetching

import Home from "./pages/home/Home"
import Leaderboard from "./pages/leaderboard/Leaderboard"
import { Page as Authentication } from "./pages/authentication"
import { Outlet, Route, Routes, Navigate } from "react-router-dom"
import Topbar from "./components/topbar/Topbar"
import ChatBox from "./components/chatBox/ChatBox"
import RoomView from "./components/chatBox/RoomView"
import ChatJoin from "./components/chatBox/ChatJoin"
import ChannelCreate from "./pages/channels/ChannelCreate"
import Matches from "./components/profileban/Matches"
import Achievements from "./components/profileban/Achievements"
import Friends from "./components/profileban/Friends"
import ProfileSettings from "./components/profileban/ProfileSettings"
import Users from "./pages/users/Users"
import { useAuth } from "./data/use-auth"
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"

function Layout() {
    return (
        <>
            <Topbar />
            <Outlet />
        </>
    )
}

function PrivateRoute({ children }) {
    const auth = useAuth()

    return auth.connected ? children : <Navigate to="/auth" replace />
}

function Router() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route
                    path="chat"
                    element={
                        <PrivateRoute>
                            <ChatBox />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<ChatJoin />} />
                    <Route path="create" element={<ChannelCreate />} />
                    <Route path="room/:channelId" element={<RoomView />} />
                </Route>
                <Route
                    path="leaderboard"
                    element={
                        <PrivateRoute>
                            <Leaderboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/users/:userId"
                    element={
                        <PrivateRoute>
                            <Users />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Matches />} />
                    <Route path="matches" element={<Matches />} />
                    <Route path="achievements" element={<Achievements />} />
                    <Route path="friends" element={<Friends />} />
                    <Route path="settings" element={<ProfileSettings />} />
                </Route>
                <Route path="auth" element={<Authentication />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        </Routes>
    )
}

export default function App() {
    return <ErrorBoundary fallbackRender={({error}) => (<p>Error??? {error.toString()}</p>)}>
        <Suspense fallback={<p>No fallback so loading here :)</p>}>
        <Router />
        </Suspense>
    </ErrorBoundary>
}
