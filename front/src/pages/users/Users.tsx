import { useParams } from "react-router-dom"
import "./users.scss"

function Users() {
    let { id } = useParams()

    return <div className="users">User id : {id}</div>
}

export default Users
