// TODO: Check for lazy route component fetching

import Profile from "./pages/profile/Profile"
import Home from "./pages/home/Home"
import Chat from "./pages/chat/Chat"
import Leaderboard from "./pages/leaderboard/Leaderboard"
import { Page as Authentication } from "./pages/authentication"
import { Route, Routes } from 'react-router-dom'
import Topbar from "./components/topbar/Topbar"

function App() {
    return (
    <div>
        <Routes>
            <Route path="/auth" element={<Authentication />} />
            <Route path="/*" element={<Topbar />} />
        </Routes>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    </div>
    );
}

export default App;

/*
<Route path="/">
            <Topbar />
        </Route>
        <Route exact path="/">
            <Home />
        </Route>
        <Route exact path="/profile">
            <Profile />
        </Route>
        <Route exact path="/chat">
            <Chat />
        </Route>
        <Route exact path="/leaderboard">
            <Leaderboard />
        </Route>
		<Route path="/auth">
			<Authentication />
		</Route>
*/