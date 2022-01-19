import { Controller, Get, Query, Res, Session, Redirect } from "@nestjs/common";
import { AuthService } from "./auth.service";
import axios, { AxiosResponse } from "axios";
import session from "express-session";

const api42Config = {
  uid: "fa0f13e6daf52c3590217ebadc4c2cd9e757fac12b997d6abf3ac7d089af7254",
  secret: "d92778332ac24fcfdafd152a871246f1b6c99e0fe28f555c3277106c60b9fdbb",
  redirect_uri: "http://localhost:3000/auth/callback",
  endpoint: "https://api.intra.42.fr/v2",
};

function api42request(
  path: string,
  token: string,
): Promise<AxiosResponse<any, any>> {
  return axios.get(api42Config.endpoint + path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

const oauth_url = new URL("/oauth/authorize", "https://api.intra.42.fr")
oauth_url.searchParams.set("client_id", api42Config.uid)
oauth_url.searchParams.set("redirect_uri", api42Config.redirect_uri)
oauth_url.searchParams.set("response_type", "code")

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @Redirect(oauth_url.toString())
  redirect() { }

  @Get("debug")
  debug(@Session() session: Record<string, any>): string {
    return JSON.stringify(session);
  }

  @Get("callback")
  async callback(
    @Session() session: Record<string, any>,
    @Query("code") code,
    @Res() res,
  ): Promise<string> {
    if (!code) return "Error: missing code in get params";
    try {
      const data = (
        await axios.post(
          "https://api.intra.42.fr/oauth/token",
          {
            grant_type: "authorization_code",
            client_id: api42Config.uid,
            client_secret: api42Config.secret,
            code: code,
            redirect_uri: api42Config.redirect_uri,
          },
          { headers: { "content-type": "application/json" } },
        )
      ).data;
      const userRaw = (await api42request("/me", data.access_token)).data;
      const user = {
        id: userRaw.id,
        login: userRaw.login,
        first_name: userRaw.first_name,
        last_name: userRaw.last_name,
        image_url: userRaw.image_url,
      };
      session.user = user;
      return res.redirect("/auth/debug");
    } catch (error) {
      console.error(error);
      return "Interal error";
    }
  }
}
