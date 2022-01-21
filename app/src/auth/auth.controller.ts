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

	//THIS IS FOR LE TEST DONT PANIC MONSIEUR ARNAUD

    @UseGuards(ConnectedGuard)
    @Get("enable2fa")
    async enable2fa(@Request() req: any) {
        let user = await this.users.find(req.user.id);
        user = await this.users.enable2fa(user);
        return this.users.get2faQr(user);
    }

    @UseGuards(ConnectedGuard)
    @Get("disable2fa")
    async disable2fa(@Request() req: any) {
        let user = await this.users.find(req.user.id);
        user = await this.users.disable2fa(user);
        return JSON.stringify(user);
    }

    @UseGuards(ConnectedGuard)
    @Get("test2fa")
    async test2fa(@Request() req: any, @Query("token") token: string) {
        const user = await this.users.find(req.user.id);
        return this.users.check2fa(user, token);
    }
}
