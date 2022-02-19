import { Injectable } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { JwtService } from "@nestjs/jwt"
import { SocketsService } from "src/sockets/sockets.service"
import { IntraInfosDto } from "src/users/dto/intra_infos.dto"
import { User } from "src/users/entities/user.entity"
import { UsersService } from "src/users/users.service"
import { ConnectDto } from "./auth.dto"
import { FortyTwoService } from "./fortytwo.service"

type TokenPayload = {
    sub: number
}

@Injectable()
export class AuthService {
    constructor(
        private fortytwo: FortyTwoService,
        private users: UsersService,
        private jwt: JwtService,
        private sockets: SocketsService
    ) {}

    async login(
        payload: ConnectDto
    ): Promise<{ created: boolean; user: User }> {
        const accessToken = await this.fortytwo.fetchAccessToken(payload)
        const intra_user = await this.fortytwo.fetchSelf(accessToken)

        let user = await this.users.findIntra(intra_user.id)
        const created = !user

        if (!user) {
            user = await this.users.create(intra_user)
        } else {
            await this.users.updateIntra(user, intra_user)
        }

        return { created, user }
    }

    async fake_login(payload: IntraInfosDto): Promise<User> {
        let user = await this.users.findIntra(payload.id)

        if (!user) {
            user = await this.users.create(payload)
        } else {
            await this.users.updateIntra(user, payload)
        }

        return user
    }

    createToken(user: User): Promise<string> {
        const payload = {
            sub: user.id,
        }

        return this.jwt.signAsync(payload)
    }

    verify(token: string): Promise<TokenPayload> {
        return this.jwt.verifyAsync(token)
    }

    @OnEvent("socket.auth")
    onAuthentication({ socket, userId }) {
        this.sockets.join(socket, `users.${userId}`)
    }
}
