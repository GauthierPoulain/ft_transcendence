import {
    Controller,
    Get,
    Request,
    UseGuards,
    Query,
    Post,
    Body,
    UnauthorizedException,
} from "@nestjs/common";

import { UsersService } from "../users/users.service";

import { ConnectedGuard } from "./connected.guard";
import { AuthService } from "./auth.service";
import { ConnectDto } from "./dto/connect.dto";

@Controller("auth")
export class AuthController {
    constructor(private auth: AuthService, private users: UsersService) {
    }

    @Post("login")
    async login(@Body() payload: ConnectDto) {
        // TODO: Make the ConnectDto class perform validation (non empty strings)

        const user = await this.auth.login(payload).catch(() => {
            // If we make a request with an invalid code our server will reply with a 500.
            // Map the error with a unauthorized response.
            throw new UnauthorizedException()
        })

        // Before creating an authentication token we could verify if the 2FA is enabled and issue
        // another type of token.

        return {
            token: await this.auth.createToken(user)
        }
    }
}
