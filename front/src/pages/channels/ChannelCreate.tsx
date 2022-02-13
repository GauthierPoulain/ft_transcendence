import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useSWRConfig } from "swr"
import "./style.css"
import { createChannel } from "../../data/use-channel"

export default function ChannelCreate() {
    const { mutate } = useSWRConfig()

    const [name, setName] = useState("")
    const [joinable, setJoinable] = useState(false)
    const [password, setPassword] = useState("")

    async function submit(event: any) {
        event.preventDefault()

        const channel = await createChannel({ name, joinable, password })

        mutate(`/channels/${channel.id}`, channel)
        mutate("/channels/joined")
        mutate("/channels")
    }

    return (
        <Form onSubmit={submit} className="chanCreate">
            <Form.Group>
                <Form.Label>Channel name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter channel name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </Form.Group>

            <Form.Group>
                <Form.Check
                    label="Publicly joinable"
                    checked={joinable}
                    onChange={(event) => setJoinable(event.target.checked)}
                />
            </Form.Group>

            {joinable && (
                <Form.Group>
                    <Form.Label>Channel password</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter channel password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <Form.Text>No password means anyone can join.</Form.Text>
                </Form.Group>
            )}

            <Button variant="primary" type="submit">
                Create
            </Button>
        </Form>
    )
}
