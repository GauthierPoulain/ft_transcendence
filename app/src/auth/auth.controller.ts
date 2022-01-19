import {
    Controller,
    Get,
    Session,
    Redirect,
    Request,
    UseGuards,
} from "@nestjs/common";

import { UsersService } from "../users/users.service"
import { OAuth2AuthGuard } from "./guards/oauth2-auth.guard";

function waitSession(req: any): Promise<void> {
    return new Promise((resolve) => {
        req.session.save(() => {
            resolve();
        });
    });
}

@Controller("auth")
export class AuthController {
    constructor(
        private usersService: UsersService,
    ) {}

    @UseGuards(OAuth2AuthGuard)
    @Get()
    login() { }

    @UseGuards(OAuth2AuthGuard)
    @Get("callback")
    @Redirect("/users/me")
    async login_callback(
        @Session() session: Record<string, any>,
        @Request() req: any
    ) {
        const { id, login, image_url } = req.user;

        let user = await this.usersService.findIntra(id);

        // In case no user with this intra exists, create it.
        if (!user) {
            user = await this.usersService.create({
                intra_id: id,
                intra_login: login,
                intra_image_url: image_url,
            });
        }

        console.log(session)
        session.user = user.id;
        await waitSession(req);
        return;
    }

    @Get("debug")
    debug(@Session() session: Record<string, any>, @Request() req: any): string {
        console.log("debug");
        console.log(session);

        return `session id : ${req.sessionID}<br>${JSON.stringify(session)}`;
    }


    @Get("logout")
    @Redirect("/auth/debug")
    async logout(@Session() session: Record<string, any>, @Request() req: Request) {
        delete session.user;
        await waitSession(req);
        return;
    }
}
