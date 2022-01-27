import React from "react";

import Tcanvas from "./components/Tcanvas";
import Cbutton from "./components/Cbutton";

function App() {
    return (
        <div>
            <Tcanvas width="1000px" height="500px"></Tcanvas>
            <Cbutton>Salut</Cbutton>
        </div>
    );
}

export default App;
