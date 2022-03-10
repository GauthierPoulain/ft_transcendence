import { IsNotEmpty, IsString } from "class-validator"
import { User } from "src/users/entities/user.entity"

export class ConnectDto {
    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsNotEmpty()
    redirect_uri: string
}

export class UpgradeDto {
    @IsString()
    @IsNotEmpty()
    token: string

    @IsString()
    @IsNotEmpty()
    tfa: string
}

export class AuthResponse {
    token: string
    created: boolean
    user: User
}

export type TokenPayload = {
    sub: number,
    aud: "auth" | "tfa"
}

