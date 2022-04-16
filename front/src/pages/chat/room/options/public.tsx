import { Button } from "react-bootstrap"
import { fetcherPost, useSubmit } from "../../../../data/use-fetch"

export default function MakePublicButton({ channelId }) {
    const { submit, isLoading } = useSubmit(() => {
        return fetcherPost(`/channels/${channelId}/state/public`, {})
    })

    return (
        <Button
            variant="secondary"
            size="sm"
            onClick={submit}
            disabled={isLoading}
        >
            Make public
        </Button>
    )
}
