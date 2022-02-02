import Profile from "./pages/profile/Profile"
import Home from "./pages/home/Home"
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
    </div>
    );
}

export default App;
