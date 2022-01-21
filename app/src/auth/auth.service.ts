import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { ConnectDto } from "./dto/connect.dto";
import { FortyTwoService } from "./fortytwo.service";

@Injectable()
export class AuthService {
    constructor(
        private fortytwo: FortyTwoService,
        private users: UsersService,
        private jwt: JwtService
    ) { }

    async login(payload: ConnectDto): Promise<User> {
        const accessToken = await this.fortytwo.fetchAccessToken(payload)
        const intra_user = await this.fortytwo.fetchSelf(accessToken)

        let user = await this.users.findIntra(intra_user.id)

        if (!user) {
            user = await this.users.create(intra_user)
        } else {
            await this.users.updateIntra(user, intra_user)
        }

        return user
    }

    createToken(user: User): Promise<string> {
        const payload = {
            sub: user.id
        };

        return this.jwt.signAsync(payload)
    }
}
