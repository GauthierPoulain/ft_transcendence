import { useAuth } from "../../auth";
import { useResource } from "rest-hooks";
import { UserResource } from "../../api/resources/UserResource";
import { Link } from "react-router-dom";
import "./profile.scss";
import { Button } from "react-bootstrap";
import Profileban from "../../components/profileban/Profileban";
import { Brightness1 } from "@material-ui/icons";
import { Routes, Route, Outlet } from "react-router-dom";
import { Edit } from "@material-ui/icons"

function ProfileConnected() {
    const user = useResource(UserResource.current(), {});
    const url = "https://profile.intra.42.fr/users/" + user.intra_login;

    return (
        <div>
            <div className="profileContainer">
                <div className="profleft">
                    <a href={url} target="_blank">
                        <img
                            src={user.intra_image_url}
                            alt=""
                            className="profilePicture"
                        />
                    </a>
                    <div className="profileName">
                        <span>{user.intra_login}</span>
                    </div>
                </div>
                <div className="profcenter">
                    <span className="profText">
                        Victories:
                        <span className="profPoint">13</span>
                    </span>
                    <span className="profText">
                        Rank:
                        <span className="profPoint">#4</span>
                    </span>
                </div>
                <div className="profright">
                    <span>ONLINE</span>
                    <Brightness1 className="profConnected" />
                </div>
            </div>
        </div>
    );
}

function Layout() {
    return (
        <>
            <div>
                <Profileban>
                    <ProfileConnected />
                </Profileban>

                <div className="profNav">
                    <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic example"
                    >
                        <button type="button" className="btn btn-light btn-lg">
                            <Link to="matches" className="proflinks">
                                Matches
                            </Link>
                        </button>
                        <button type="button" className="btn btn-light btn-lg">
                            <Link
                                to="achievements"
                                className="proflinks"
                            >
                                Achievements
                            </Link>
                        </button>
                        <button type="button" className="btn btn-light btn-lg">
                            <Link to="friends" className="proflinks">
                                Friends
                            </Link>
                        </button>

                        <button type="button" className="btn btn-warning btn-lg">
                            <Link to="settings" className="proflinks">
                                <Edit />
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function Profile() {
    const auth = useAuth();

    if (!auth.connected) {
        return (
            <div className="notConnected">
                <p>You're not connected</p>
                <Link to="/auth" className="links">
                    <Button>Sign in here !</Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <Layout />
            <Outlet />
        </div>
    );
}

export default Profile;
