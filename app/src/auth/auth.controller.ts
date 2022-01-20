import {
    Controller,
    Get,
    Session,
    Redirect,
    Request,
    UseGuards,
    Query,
} from "@nestjs/common";

import { UsersService } from "../users/users.service";
import { OAuth2AuthGuard } from "./guards/oauth2-auth.guard";

import * as twoFactors from "node-2fa";

import { promisify } from "util";

@Controller("auth")
export class AuthController {
    constructor(private usersService: UsersService) {}

    @UseGuards(OAuth2AuthGuard)
    @Get()
    login() {
        console.log("/auth");
    }

    @UseGuards(OAuth2AuthGuard)
    @Get("callback")
    @Redirect("/users/me")
    async login_callback(@Request() req: any) {
        const { id, login, image_url } = req.user;

        console.log("callback");

        let user = await this.usersService.findIntra(id);

        // In case no user with this intra exists, create it.
        if (!user) {
            user = await this.usersService.create({
                intra_id: id,
                intra_login: login,
                intra_image_url: image_url,
            });
        } else {
            user = await this.usersService.updateIntra(user, {
                intra_id: id,
                intra_login: login,
                intra_image_url: image_url,
            });
        }

        await promisify(req.logIn.bind(req))(user);
    }

    @Get("debug")
    debug(
        @Session() session: Record<string, any>,
        @Request() req: any,
    ): string {
        return `session id : ${req.sessionID}<br>${JSON.stringify(session)}`;
    }

    @Get("logout")
    @Redirect("/auth/debug")
    async logout(@Request() req: any) {
        req.logOut();
        await promisify(req.session.destroy.bind(req.session))();
    }

    @Get("2fa")
    tfa() {
        const appName = "ft_transcendance";
        const userName = "bite";

        let secret = twoFactors.generateSecret({
            name: appName,
            account: userName,
        });

        console.log(secret);

        return secret.qr;
    }

    @Get("a")
    a() {
        return twoFactors.generateToken("W67SXM5AAQBLYUDYYWGOBWYHLUD2KYTD");
    }

    @Get("b")
    b(@Query("code") code) {
        return JSON.stringify(
            twoFactors.verifyToken("W67SXM5AAQBLYUDYYWGOBWYHLUD2KYTD", code),
        );
    }
}
