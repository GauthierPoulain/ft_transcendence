import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { fetcher, fetcherDelete, useSubmit } from "../../../data/use-fetch";
import "./style.scss";

export default function AvatarSection() {
    const [file, setFile] = useState<File | undefined>(undefined)

    const upload = useSubmit<File, void>((file) => {
        const body = new FormData()
        body.append("avatar", file)

        return fetcher("/settings/avatar", { method: "POST", body }, false);
    })

    const remove = useSubmit<void, void>(() => {
        return fetcherDelete("/settings/avatar")
    })

    async function submitForm(event: any) {
        event.preventDefault()

        if (file) {
            await upload.submit(file)
        }
    }

    const loading = upload.isLoading || remove.isLoading

    return (
        <div className="mb-3">
            <Form className="mb-3" onSubmit={submitForm}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Your custom avatar</Form.Label>
                    <Form.Control
                        type="file"
                        className="border-dark bg-dark"
                        placeholder="Enter custom username"
                        onChange={(event: any) => setFile(event.target.files[0])}
                    />
                </Form.Group>

                <Button
                    size="sm"
                    variant="primary"
                    type="submit"
                    disabled={!file || loading}
                >
                    Upload new avatar
                </Button>
            </Form>

            <Button
                size="sm"
                variant="danger"
                disabled={loading}
                onClick={() => remove.submit()}
            >
                Restore intra avatar
            </Button>
        </div>
    )
}
