import { Delete } from "@mui/icons-material"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { Message } from "../../../../data/messages"
import { fetcherDelete, useSubmit } from "../../../../data/use-fetch"

export default function DeleteButton({ message }) {
    const { submit, isLoading } = useSubmit(({ channelId, id }: Message) =>
        fetcherDelete(`/channels/${channelId}/messages/${id}`)
    )

    async function remove() {
        if (!isLoading) {
            await submit(message)
        }
    }

    return (
        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
            <Delete
                className="text-danger cursor-pointer"
                fontSize="inherit"
                onClick={remove}
            />
        </OverlayTrigger>
    )
}
