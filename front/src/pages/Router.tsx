import { useAuth } from "../data/use-auth"

import Home from "../pages/home/Home"
import Leaderboard from "../pages/leaderboard/Leaderboard"
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
import Relations from "./users/relations"
import Matchmaking from "./game/matchmaking"
import GameLayout from "./game/layout"
import GameView from "./game/view"
import ChallengeUser from "./users/challenge"
import LoginIntra from "./authentication/login-intra"
import LoginFake from "./authentication/login-fake"
import Authentication from "../pages/authentication"

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
                <Route path="game" element={<GameLayout />}>
                    <Route path="matchmaking" element={<Matchmaking />} />
                    <Route path=":gameId" element={<GameView />} />
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
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="/users/:userId" element={<Users />}>
                    <Route index element={<Navigate to="matches" replace />} />
                    <Route path="matches" element={<Matches />} />
                    <Route path="achievements" element={<Achievements />} />
                    <Route path="relations" element={<Relations />} />
                    <Route path="settings" element={<ProfileSettings />} />
                    <Route path="challenge" element={<ChallengeUser />} />
                </Route>
                <Route path="auth" element={<Authentication />}>
                    <Route index element={<LoginIntra />} />
                    <Route path="secret/fakeone" element={<LoginFake user="one" />} />
                    <Route path="secret/faketwo" element={<LoginFake user="two" />} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        </Routes>
    )
}
