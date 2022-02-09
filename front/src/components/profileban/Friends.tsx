import "./friends.scss";
import { Brightness1 } from "@material-ui/icons";
import { Link } from "react-router-dom";

function Dot(props: any)
{
    const status = props.status.toString();

    if (status === "ONLINE")
    {
        return (
            <Brightness1 className="Ondot"/>
        )
    }

    return (
        <Brightness1 className="Offdot"/>
    )
}

function FriendsTab(props:any)
{

    return (
        <div className="friendTab">
            <img src={props.pic} className="pic" alt="" />
            <p className="text">{props.text}</p>
            <p className="status">status: {props.status}
                <Dot status={props.status}/>
            </p>
        </div>
    )
}

function FriendList(props:any)
{
    return (
        <div className="friendList">
            {props.children}
        </div>
    )
}

function Friends() {
    return (
        <div className="friendsContainer">
            <h1>FRIENDS</h1>

            <FriendList>
                <FriendsTab pic="/assets/42.jpg" text="ldevilla" status="ONLINE"/>
                <FriendsTab pic="/assets/42.jpg" text="ldevilla" status="OFFLINE"/>
                <FriendsTab pic="/assets/42.jpg" text="ldevilla" status="ONLINE"/>
            </FriendList>

        </div>
    );
}

export default Friends;
