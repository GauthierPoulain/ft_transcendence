import { Button } from "react-bootstrap";
import { useMemberByUser } from "../../../../data/members";
import { useAuth } from "../../../../data/use-auth";
import { useRemoveMember } from "../../../../data/use-member";

export default function LeaveChannelButton() {
    const auth = useAuth()
    const member = useMemberByUser(auth.userId)!
    const { submit, isLoading } = useRemoveMember()

    return (
        <Button variant="danger" size="sm" onClick={() => submit({ id: member.id })} disabled={isLoading}>
            Leave channel
        </Button>
    )
}
