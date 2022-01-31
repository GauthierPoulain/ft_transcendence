import Tcanvas from "./components/Tcanvas";
import Cbutton from "./components/Cbutton";
import Mprofile from "./components/MiniProfile";

function App() {
    return (
        <div>
            <Tcanvas width="1000px" height="500px"></Tcanvas>
            <Cbutton id="menu">Salut</Cbutton>
            <Mprofile></Mprofile>
        </div>
    );
}

export default App;
