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
import session from "express-session";
import { Observable, firstValueFrom } from "rxjs";

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
    ) {}

    @Get()
    @Redirect(oauth_url.toString())
    redirect() {}

    @Get("debug")
    debug(@Session() session: Record<string, any>): string {
        return JSON.stringify(session);
    }

    @Get("callback")
    async callback(
        @Session() session: Record<string, any>,
        @Query("code") code: string,
        @Res() res,
    ): Promise<string> {
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
            data: { id, login, first_name, last_name, image_url },
        } = await api42request(this.httpService, "me", data.access_token);

        session.user = { id, login, first_name, last_name, image_url };

        return res.redirect("/auth/debug");
    }
}
