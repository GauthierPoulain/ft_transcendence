import { Image } from "react-bootstrap"
import useUser from "../../data/use-user"

export default function UserAvatar({ userId, className }) {
    const user = useUser(userId)!

    // TODO: Use exposed image folder with nginx
    const src = user.has_custom_image
        ? "https://via.placeholder.com/150"
        : user.image

    return (
        <Image
            roundedCircle
            src={src}
            className={`object-cover aspect-square ${className}`}
        />
    )
}
