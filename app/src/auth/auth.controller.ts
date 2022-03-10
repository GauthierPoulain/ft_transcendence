import { Controller, Post, Body, UnauthorizedException, BadRequestException, NotFoundException } from "@nestjs/common"
import { IntraInfosDto } from "src/users/dto/intra_infos.dto"

import { AuthService } from "./auth.service"
import { AuthResponse, ConnectDto, UpgradeDto } from "./auth.dto"
import { UsersService } from "src/users/users.service"
import { verifyToken } from "node-2fa"

@Controller("auth")
export class AuthController {
    constructor(private auth: AuthService, private users: UsersService) {}

    @Post("login")
    async login(@Body() payload: ConnectDto): Promise<AuthResponse> {
        const { user, created } = await this.auth.login(payload).catch(() => {
            // If we make a request with an invalid code our server will reply with a 500.
            // Map the error with a unauthorized response.
            throw new UnauthorizedException()
        })

        // Before creating an authentication token we could verify if the 2FA is enabled and issue
        // another type of token.

        return {
            token: await this.auth.createToken(user, user.tfa),
            created,
            user,
        }
    }

    @Post("upgrade")
    async upgrade(@Body() body: UpgradeDto): Promise<AuthResponse> {
        const payload = await this.auth.verify(body.token)

        if (payload.aud !== "tfa") {
            throw new BadRequestException()
        }

        const user = await this.users.find(payload.sub)

        if (!user) {
            throw new NotFoundException()
        }

        if (user.tfa) {
            const verify = verifyToken(user.tfa_secret, body.tfa)

            if (!verify || verify.delta !== 0) {
                throw new UnauthorizedException()
            }
        }

        return {
            token: await this.auth.createToken(user, false),
            created: false,
            user
        }
    }

    // TODO: Need to be disabled on production.

    @Post("fake_login_one")
    async fake_login_one(): Promise<AuthResponse> {
        const payload: IntraInfosDto = {
            id: 2142000001,
            login: "fake_user_one",
            image_url: "https://via.placeholder.com/300x150/0000FF",
        }

        const user = await this.auth.fake_login(payload)

        return {
            token: await this.auth.createToken(user, user.tfa),
            created: true,
            user,
        }
    }

    @Post("fake_login_two")
    async fake_login_two(): Promise<AuthResponse> {
        const payload: IntraInfosDto = {
            id: 2142000002,
            login: "fake_user_two",
            image_url: "https://via.placeholder.com/150/00FF00",
        }

        const user = await this.auth.fake_login(payload)

        return {
            token: await this.auth.createToken(user, user.tfa),
            created: false,
            user,
        }
    }
}
