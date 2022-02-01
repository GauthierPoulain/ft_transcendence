import Tcanvas from "./components/Tcanvas";
import Cbutton from "./components/Cbutton";
import Mprofile from "./components/MiniProfile";
import NavButton from "./components/NavButton";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

function App() {
    return (
        <Router>
            <div>
                <div class="navbar">
                    <Link to="/leaderboard">
                        <NavButton id="navbutton">Leaderboard</NavButton>
                    </Link>
                    <Link to="/chat">
                        <NavButton id="navbutton">Chat</NavButton>
                    </Link>
                    <Link to="/friendlist">
                        <NavButton id="navbutton">Friend List</NavButton>
                    </Link>
                </div>

                <Route exact path="/">
                    <Tcanvas width="1000px" height="500px"></Tcanvas>
                </Route>
                    <Cbutton id="menu">Pouic</Cbutton>
                <Mprofile></Mprofile>
            </div>
        </Router>
    );
}

export default App;
