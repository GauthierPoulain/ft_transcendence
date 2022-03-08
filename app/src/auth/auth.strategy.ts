import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy as InnerJwtStrategy } from "passport-jwt"
import { Strategy as InnerAnonymousStrategy } from "passport-anonymous"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class JwtStrategy extends PassportStrategy(InnerJwtStrategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: Buffer.from(config.get<string>("JWT_SECRET"), "base64")
        })
    }

    async validate(payload: any) {
        // TODO: Put the type of the token inside the object.
        // TODO: Check if the token is an authentication one.
        return { id: payload.sub }
    }
}

@Injectable()
export class AnonymousStrategy extends PassportStrategy(
    InnerAnonymousStrategy
) {}
