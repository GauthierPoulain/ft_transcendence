import Tcanvas from "./components/Tcanvas";
import Cbutton from "./components/Cbutton";
import Mprofile from "./components/MiniProfile";
import Profile from "./pages/profile/Profile"
import Home from "./pages/home/Home"
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

function App() {
    return (
    <div>
        <Route exact path="/">
            <Home />
        </Route>
        <Route exact path="/profile">
            <Profile />
        </Route>
    </div>
    );
}

export default App;
