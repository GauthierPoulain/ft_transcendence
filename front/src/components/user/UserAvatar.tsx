import { Image } from "react-bootstrap"
import useUser from "../../data/use-user"

export default function UserAvatar({ userId, className }) {
    const user = useUser(userId)!

    const src = user.has_custom_image
        ? `http://${document.location.hostname}/avatars/${user.image}`
        : user.image

    return (
        <Image
            roundedCircle
            src={src}
            className={`object-cover aspect-square ${className}`}
        />
    )
}
