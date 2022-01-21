import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "TODO: this should be generated with cryptogaphic random later"
        })
    }

    async validate(payload: any) {
        // TODO: Put the type of the token inside the object.
        return { id: payload.sub }
    }
}
