import Tcanvas from "./components/Tcanvas";
import Cbutton from "./components/Cbutton";
import Mprofile from "./components/MiniProfile";
import NavBar from "./components/NavBar";

function App() {
    return (
        <div>
            <NavBar id="navbar"></NavBar>

            <Tcanvas width="1000px" height="500px"></Tcanvas>
            <Cbutton id="menu">Pouic</Cbutton>
            <Mprofile></Mprofile>
        </div>
    );
}

export default App;
