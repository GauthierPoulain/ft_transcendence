import { useState } from "react"
import { useResource, useController } from "@rest-hooks/core"
import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap"
import { Link, useParams } from "react-router-dom"
import { ChannelResource } from "../../api/resources/ChannelResource"
import { MessageResource } from "../../api/resources/MessageResource"
import "./roomview.css"
import { api } from "../../services"
import { Membership } from "../../services/channels"
import { User } from "../../services/users"

function Member({ member }) {
    const { data, isLoading, isError } = api.endpoints.getUser.useQuery(member.userId)

    if (isError) {
        return <p>Error...</p>
    }

    if (isLoading) {
        return <p>Loading...</p>
    }

    const user = data as User

    return <Link className="memberLinks" to={`/users/${user.id}`}>
        <img className="imgMember" src={user.image} alt="" />
        {user.nickname} - {member.role}
    </Link>
}

function Members({ channelId }) {
    const { data, isLoading, isError } = api.endpoints.getChannelMembers.useQuery(channelId)

    if (isError) {
        return <p>Error...</p>
    }

    if (isLoading) {
        return <p>Loading...</p>
    }

    const members = data as Membership[]

    return <Stack>
        { members.map((member) => <Member key={member.id} member={member} />) }
    </Stack>
}

export default function RoomView() {
    const { channelId } = useParams()
    const { fetch } = useController()

    const [channel, messages] = useResource(
        [ChannelResource.detail(), { id: channelId }],
        [MessageResource.list(), { channelId }],
    )

    const [buffer, setBuffer] = useState("")

    const onSubmit = (event: any) => {
        event.preventDefault()

        const request = fetch(
            MessageResource.create(),
            { channelId },
            { content: buffer }
        )
        setBuffer("")

        console.log(request)
    }

    return (
        <Container fluid className="chatContainer">
            <Row>
                <Col className="chatView">
                    <h2 className="chatTitle">{channel.name}</h2>
                    <Stack gap={2}>
                        {messages.map(({ id, content, author }) => (
                            <div key={id}>
                                <span className="h5">
                                    {author?.nickname}:{" "}
                                </span>
                                <span>{content}</span>
                            </div>
                        ))}
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
                </Col>

                <Col xs={2} className="memberView">
                    <h2 className="memberTitle">Members</h2>

                    <Members channelId={channelId} />
                </Col>
            </Row>
        </Container>
    )
}
