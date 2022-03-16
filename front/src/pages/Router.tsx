import { useAuth } from "../data/use-auth"

import Home from "../pages/home/Home"
import Leaderboard from "../pages/leaderboard/Leaderboard"
import { Page as Authentication } from "../pages/authentication"
import { Outlet, Route, Routes, Navigate } from "react-router-dom"
import Topbar from "../components/topbar/Topbar"

import Chat from "./chat"
import RoomView from "./chat/room"
import ChatJoin from "./chat/join"
import ChannelCreate from "./chat/create"

import Matches from "./users/matches"
import Achievements from "./users/achievements"
import ProfileSettings from "./users/settings"
import Users from "./users"
import Game from "./game/game"
import Relations from "./users/relations"
import Matchmaking from "./game/matchmaking"

// import TwoFactorAuth from "./twoFactorAuth"

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

// TODO: Limit private routes in user.
export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="game" element={<Outlet />}>
                    <Route path="matchmaking" element={<Matchmaking />} />
                    <Route path=":gameId" element={<Game />} />
                </Route>
                <Route
                    path="chat"
                    element={
                        <PrivateRoute>
                            <Chat />
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
                    <Route index element={<Navigate to="matches" replace />} />
                    <Route path="matches" element={<Matches />} />
                    <Route path="achievements" element={<Achievements />} />
                    <Route path="relations" element={<Relations />} />
                    <Route path="settings" element={<ProfileSettings />} />
                </Route>
                <Route path="auth" element={<Authentication />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        </Routes>
    )
}
