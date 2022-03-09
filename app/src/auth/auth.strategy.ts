import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy as InnerJwtStrategy } from "passport-jwt"
import { Strategy as InnerAnonymousStrategy } from "passport-anonymous"
import { ConfigService } from "@nestjs/config"
import { TokenPayload } from "./auth.dto"

@Injectable()
export class JwtStrategy extends PassportStrategy(InnerJwtStrategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: Buffer.from(config.get<string>("JWT_SECRET"), "base64")
        })
    }

    async validate({ sub, aud }: TokenPayload) {
        if (aud !== "auth") {
            throw new UnauthorizedException();
        }

        return { id: sub }
    }
}

@Injectable()
export class AnonymousStrategy extends PassportStrategy(
    InnerAnonymousStrategy
) {}
