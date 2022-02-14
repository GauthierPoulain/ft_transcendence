import { useState } from "react"
import { Stack } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import "./roomview.css"
import useUser from "../../data/use-user"
import { useMembers } from "../../data/use-member"
import useChannel from "../../data/use-channel"

function Member({ member }) {
    const user = useUser(member.userId)

    return <Link className="memberLinks" to={`/users/${user.id}`}>
        <img className="imgMember" src={user.image} alt="" />
        {user.nickname} - {member.role}
    </Link>
}

function Members({ channelId }) {
    const members = useMembers(channelId)

    return <Stack>
        { members.map((member) => <Member key={member.id} member={member} />) }
    </Stack>
}

export default function RoomView() {
    const { channelId } = useParams()
    const channel = useChannel(parseInt(channelId as string, 10))

    const [buffer, setBuffer] = useState("")

    const onSubmit = (event: any) => {
        event.preventDefault()

        setBuffer("")
    }

    return (
        <>
            <div className="flex-grow-1">
                <h2>{channel.name}</h2>
                <Stack gap={2}>
                    {/*messages.map(({ id, content, author }) => (
                        <div key={id}>
                            <span className="h5">
                                {author?.nickname}:{" "}
                            </span>
                            <span>{content}</span>
                        </div>
                    ))*/}
                </Stack>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        value={buffer}
                        onChange={(event) => setBuffer(event.target.value)}
                        placeholder="type something..."
                        className="inputHolder"
                    />
                </form>
            </div>

            <div className="mx-3">
                <h2 className="memberTitle">Members</h2>

                <Members channelId={channelId} />
            </div>
        </>
    )
}
