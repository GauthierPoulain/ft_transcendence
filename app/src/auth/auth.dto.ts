import { User } from "src/users/entities/user.entity"

export class ConnectDto {
    code: string
    redirect_uri: string
}

export class AuthResponse {
    token: string
    created: boolean
    user: User
}
