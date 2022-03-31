import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { createChannel } from "../../../data/channels"
import "./channelcreate.scss"

export default function ChannelCreate() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [joinable, setJoinable] = useState(false)
    const [password, setPassword] = useState("")

    async function submit(event: any) {
        event.preventDefault()

        const channel = await createChannel({ name, joinable, password })

        navigate(`/chat/room/${channel.id}`, { replace: true })
    }

    return (
        <div className="p-3 create-chan">
            <h2>Create a channel</h2>

            <Form onSubmit={submit}>
                <Form.Group className="mb-3">
                    <Form.Label>Channel name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter channel name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check>
                        <Form.Check.Input
                            checked={joinable}
                            onChange={(event) =>
                                setJoinable(event.target.checked)
                            }
                            className="border-white"
                        />
                        <Form.Check.Label>Publicly joinable</Form.Check.Label>
                    </Form.Check>
                </Form.Group>

                {joinable && (
                    <Form.Group className="mb-3">
                        <Form.Label>Channel password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter channel password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                        <Form.Text>
                            No password means anyone can join.
                        </Form.Text>
                    </Form.Group>
                )}

                <Button variant="primary" type="submit">
                    Create
                </Button>
            </Form>
        </div>
    )
}
