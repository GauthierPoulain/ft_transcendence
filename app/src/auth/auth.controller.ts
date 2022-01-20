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
} from "@nestjs/common";

import { UsersService } from "../users/users.service";
import { OAuth2AuthGuard } from "./guards/oauth2-auth.guard";

import { promisify } from "util";
import { IntraInfosDto } from "src/users/dto/intra_infos.dto";
import { ConnectedGuard } from "./guards/connected.guard";

@Controller("auth")
export class AuthController {
    constructor(private usersService: UsersService) {}

    @Post("login_intra")
    async login_intra(@Body() code: string) {
        console.log(code)
    }

    @UseGuards(OAuth2AuthGuard)
    @Get()
    login() {}

    @UseGuards(OAuth2AuthGuard)
    @Get("callback")
    @Redirect("/users/me")
    async login_callback(@Request() req: any) {
        const intra_user: IntraInfosDto = req.user;
        let user = await this.usersService.findIntra(intra_user.id);

        // In case no user with this intra exists, create it.
        if (!user) {
            user = await this.usersService.create(intra_user);
        } else {
            await this.usersService.updateIntra(user, intra_user);
        }

        await promisify(req.logIn.bind(req))(user);
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
        return await this.usersService.check2fa(user, token);
    }
}
