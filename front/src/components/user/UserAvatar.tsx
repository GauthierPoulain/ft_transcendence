import { Image } from "react-bootstrap"
import useUser from "../../data/use-user"

export default function UserAvatar({ userId, className }) {
    const user = useUser(userId)

    return <Image roundedCircle src={user.image} className={`object-cover aspect-square ${className}`} />
}
