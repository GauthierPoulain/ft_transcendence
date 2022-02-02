import Profile from "./pages/profile/Profile"
import Home from "./pages/home/Home"
import Chat from "./pages/chat/Chat"
import Leaderboard from "./pages/leaderboard/Leaderboard"
import { Route } from 'react-router-dom'

function App() {
    return (
    <div>
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
    </div>
    );
}

export default App;
