import { Container, Button, Form } from "react-bootstrap"
import { useState } from "react"

export default function ProfileSettings() {
    const [username, setUsername] = useState("")
    const [pic, setPic] = useState("")

    function submit(event: any) {
        event.preventDefault()
        console.log("changes saved")
        console.log(username)
        console.log(pic)
    }

    return (
        <Container>
            <h2>Settings</h2>

            <Form className="form" onSubmit={submit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Change your username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Change your profile picture</Form.Label>
                    <input
                        className="form-control"
                        type="file"
                        onChange={(event) => setPic(event.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check
                        type="checkbox"
                        label="Activate two factor authentification"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </Container>
    )
}
