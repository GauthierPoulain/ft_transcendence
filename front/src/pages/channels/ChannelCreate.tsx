import { useState } from "react";
import { useController } from "rest-hooks";
import { Button, Form } from "react-bootstrap";
import { ChannelResource } from "../../api/resources/ChannelResource";
import "./style.css";

export default function ChannelCreate() {
    const { fetch } = useController();
    const [name, setName] = useState("");
    const [joinable, setJoinable] = useState(false);
    const [password, setPassword] = useState("");

    function submit(event: any) {
        event.preventDefault();

        console.log(fetch);
        console.log(ChannelResource.create());
        console.log(
            fetch(
                ChannelResource.create(),
                {},
                {
                    name,
                    joinable,
                    password: joinable ? password : "",
                }
            )
        );
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
    );
}
