import {
    Controller,
    Get,
    Query,
    Res,
    Session,
    Redirect,
    BadRequestException,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { AuthService } from "./auth.service";
import { firstValueFrom } from "rxjs";
import { Response } from "express";
import { UsersService } from "../users/users.service"

const client_id = process.env.API42UID;
const client_secret = process.env.API42SECRET;
const redirect_uri = "http://localhost:3000/auth/callback";
const api_endpoint = "https://api.intra.42.fr/v2/";

function api42request(
    httpService: HttpService,
    path: string,
    token: string,
): Promise<AxiosResponse<any, any>> {
    return firstValueFrom(
        httpService.get(new URL(path, api_endpoint).toString(), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
    );
}

const oauth_url = new URL("/oauth/authorize", "https://api.intra.42.fr");
oauth_url.searchParams.set("client_id", client_id);
oauth_url.searchParams.set("redirect_uri", redirect_uri);
oauth_url.searchParams.set("response_type", "code");

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private httpService: HttpService,
        private usersService: UsersService,
    ) {}

    @Get()
    @Redirect(oauth_url.toString())
    redirect() {}

    @Get("debug")
    debug(@Session() session: Record<string, any>): string {
        console.log("debug");
        console.log(session);

        return JSON.stringify(session);
    }

    @Redirect("/users/me")
    @Get("callback")
    async callback(
        @Session() session: Record<string, any>,
        @Query("code") code: string,
        @Res() res: Response,
    ) {
        if (!code) {
            throw new BadRequestException();
        }

        const { data } = await firstValueFrom(
            this.httpService.post("https://api.intra.42.fr/oauth/token", {
                grant_type: "authorization_code",
                client_id,
                client_secret,
                code,
                redirect_uri,
            }),
        );

        const {
            data: { id, login, image_url },
        } = await api42request(this.httpService, "me", data.access_token);

        let user = await this.usersService.findIntra(id)

        // In case no user with this intra exists, create it.
        if (!user) {
            user = await this.usersService.create({ intra_id: id, intra_login: login, intra_image_url: image_url })
        }

        session.user = user.id;
    }

    @Get("logout")
    @Redirect("/auth/debug")
    logout(@Session() session: Record<string, any>) {
        delete session.user;

        console.log("logout");
    }
}
