import {
    Controller,
    Get,
    Session,
    Redirect,
    Request,
    UseGuards,
    Query,
    Post,
    Body,
    UnauthorizedException,
} from "@nestjs/common";

import { UsersService } from "../users/users.service";

import { promisify } from "util";
import { ConnectedGuard } from "./guards/connected.guard";
import { AuthService } from "./auth.service";
import { ConnectDto } from "./dto/connect.dto";

@Controller("auth")
export class AuthController {
    constructor(private auth: AuthService, private usersService: UsersService) {
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

    @UseGuards(ConnectedGuard)
    @Get("debug")
    debug(
        @Session() session: Record<string, any>,
        @Request() req: any,
    ): string {
        return `session id : ${req.sessionID}<br>${JSON.stringify(
            session,
        )}<br>${req.user}`;
    }

    @Get("logout")
    @Redirect("/auth/debug")
    async logout(@Request() req: any) {
        req.logOut();
        await promisify(req.session.destroy.bind(req.session))();
    }

	//THIS IS FOR LE TEST DONT PANIC MONSIEUR ARNAUD

    @UseGuards(ConnectedGuard)
    @Get("enable2fa")
    async enable2fa(@Request() req: any) {
        let user = req.user;
        user = await this.usersService.enable2fa(user);
        return this.usersService.get2faQr(user);
    }

    @UseGuards(ConnectedGuard)
    @Get("disable2fa")
    async disable2fa(@Request() req: any) {
        let user = req.user;
        user = await this.usersService.disable2fa(user);
        return JSON.stringify(user);
    }

    @UseGuards(ConnectedGuard)
    @Get("test2fa")
    async test2fa(@Request() req: any, @Query("token") token: string) {
        let user = req.user;
        return this.usersService.check2fa(user, token);
    }
}
