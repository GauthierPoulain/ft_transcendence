import { HttpService } from "@nestjs/axios"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { firstValueFrom } from "rxjs"
import { IntraInfosDto } from "src/users/dto/intra_infos.dto"
import { ConnectDto } from "./auth.dto"

// TODO: Look into using timeout or something else with the rxjs observable.

@Injectable()
export class FortyTwoService {
    constructor(private http: HttpService, private config: ConfigService) {}

    async fetchSelf(accessToken: string): Promise<IntraInfosDto> {
        console.log(accessToken)

        const request = this.http.get("https://api.intra.42.fr/v2/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        const { data } = await firstValueFrom(request)

        return data
    }

    async fetchAccessToken({
        code,
        redirect_uri,
    }: ConnectDto): Promise<string> {
        console.log(code, redirect_uri)
        const request = this.http.post("https://api.intra.42.fr/oauth/token", {
            grant_type: "authorization_code",
            client_id: this.config.get("API42UID"),
            client_secret: this.config.get("API42SECRET"),
            code,
            redirect_uri,
        })

        const { data } = await firstValueFrom(request)
        console.log(data)

        return data.access_token
    }
}
