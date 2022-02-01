import Tcanvas from "./components/Tcanvas";
import Cbutton from "./components/Cbutton";
import Mprofile from "./components/MiniProfile";
import NavButton from "./components/NavButton";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App() {
    return (
        <div>
            <div class="navbar">
                <NavButton id="navbutton">Leaderboard</NavButton>
                <NavButton id="navbutton">Chat</NavButton>
                <NavButton id="navbutton">Friend List</NavButton>
            </div>
            <Tcanvas width="1000px" height="500px"></Tcanvas>
            <Cbutton id="menu">Pouic</Cbutton>
            <Mprofile></Mprofile>
        </div>
    );
}

export default App;
