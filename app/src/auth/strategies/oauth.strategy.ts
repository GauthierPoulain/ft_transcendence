import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { HttpService } from "@nestjs/axios";
import { Strategy } from "passport-oauth2"
import { firstValueFrom } from "rxjs"

@Injectable()
export class OAuth2Strategy extends PassportStrategy(Strategy) {
    constructor(private httpService: HttpService) {
        super({
            authorizationURL: "https://api.intra.42.fr/oauth/authorize",
            tokenURL: "https://api.intra.42.fr/oauth/token",
            clientID: process.env.API42UID,
            clientSecret: process.env.API42SECRET,
            callbackURL: "http://localhost:3000/auth/callback"
        }, (_accessToken: string, _refreshToken: string, profile: any, callback: any) => {
            callback(null, profile)
        })
    }

    async userProfile(accessToken: string, done: any): Promise<any> {
        try {
            const request = this.httpService.get("https://api.intra.42.fr/v2/me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const { data } = await firstValueFrom(request);

            done(null, data)
        } catch (error) {
            done(error, null)
        }
    }
}
