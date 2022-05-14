import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { fetcher, fetcherDelete, useSubmit } from "../../../data/use-fetch"
import { HttpError } from "../../../errors/HttpError"
import "./style.scss"

export default function AvatarSection() {
    const [file, setFile] = useState<File | undefined>(undefined)
    const [error, setError] = useState("")

    const upload = useSubmit<File, void>((file) => {
        const body = new FormData()
        body.append("avatar", file)

        return fetcher("/settings/avatar", { method: "POST", body }, false)
    })

    const remove = useSubmit<void, void>(() => {
        return fetcherDelete("/settings/avatar")
    })

    async function submitForm(event: any) {
        event.preventDefault()

        setError("")

        if (file) {
            try {
                await upload.submit(file)
            } catch (error) {
                if (error instanceof HttpError) {
                    setError(error.api_message || "")
                } else {
                    throw error
                }
            }
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
                        accept=".jpeg, .jpg, .gif, .png"
                        className="border-dark bg-dark"
                        placeholder="Enter custom username"
                        onChange={(event: any) =>
                            setFile(event.target.files[0])
                        }
                    />
                    {error && (
                        <Form.Text className="text-danger">{error}</Form.Text>
                    )}
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
