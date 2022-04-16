import { Button } from "react-bootstrap"
import { fetcherPost, useSubmit } from "../../../../data/use-fetch"

export default function MakePrivateButton({ channelId }) {
    const { submit, isLoading } = useSubmit(() => {
        return fetcherPost(`/channels/${channelId}/state/private`, {})
    })

    return (
        <Button
            variant="secondary"
            size="sm"
            onClick={submit}
            disabled={isLoading}
        >
            Make private
        </Button>
    )
}
