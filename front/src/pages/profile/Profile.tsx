import { useAuth } from "../../auth";
import { useResource } from "rest-hooks";
import { UserResource } from "../../api/resources/UserResource";
import Topbar from "../../components/topbar/Topbar";
import { Link } from "react-router-dom";
import "./profile.css";
import { Button, Table } from "react-bootstrap";
import Profileban from "../../components/profileban/Profileban";
import { Brightness1 } from "@material-ui/icons";

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
            <div>
                <Profileban>
                    <ProfileConnected />
                </Profileban>

                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#rank</th>
                            <th>Login</th>
                            <th>Victories</th>
                        </tr>
                    </thead>
                    <tbody>
                        <td>lol</td>
                        <td>pouic</td>
                        <td>zeub</td>
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default Profile;
