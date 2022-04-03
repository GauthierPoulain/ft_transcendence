import { useMemberByUser } from "../../../../data/members";
import { useAuth } from "../../../../data/use-auth";
import LeaveChannelButton from "./leave";
import MakePrivateButton from "./private";
import MakeProtectedButton from "./protected";
import MakePublicButton from "./public";

export default function ChannelOptions({ channel }) {
    const auth = useAuth()
    const member = useMemberByUser(auth.userId)!

    return (
        <div className="d-flex align-items-stretch gap-x-2">
            { channel.type !== "direct" && <>
                <LeaveChannelButton /> 
                { channel.type !== "public" && member.role === "owner" && <MakePublicButton channelId={channel.id} /> }
                { channel.type !== "private" && member.role === "owner" && <MakePrivateButton channelId={channel.id} /> }

                { member.role === "owner" && <MakeProtectedButton channelId={channel.id} /> }
            </> }
        </div>
    )
}
