import {
    Controller,
    Post,
    Body,
    UnauthorizedException,
} from "@nestjs/common";
import { IntraInfosDto } from "src/users/dto/intra_infos.dto";

import { AuthService } from "./auth.service";
import { ConnectDto } from "./dto/connect.dto";

@Controller("auth")
export class AuthController {
    constructor(private auth: AuthService) {
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

    // TODO: Need to be disabled on production.

    @Post("fake_login_one")
    async fake_login_one() {
        const payload: IntraInfosDto = {
            id: 2142000001,
            login: "fake_user_one",
            image_url: "https://via.placeholder.com/150/0000FF"
        }

        const user = await this.auth.fake_login(payload);

        return {
            token: await this.auth.createToken(user)
        }
    }

    @Post("fake_login_two")
    async fake_login_two() {
        const payload: IntraInfosDto = {
            id: 2142000002,
            login: "fake_user_two",
            image_url: "https://via.placeholder.com/150/00FF00"
        }

        const user = await this.auth.fake_login(payload);

        return {
            token: await this.auth.createToken(user)
        }
    }
}
