import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class UserSerializer extends PassportSerializer {
    constructor(private readonly usersService: UsersService) {
        super();
    }

    serializeUser(user: User, done: Function) {
        done(null, user.id)
    }

    async deserializeUser(id: string, done: Function) {
        const user = await this.usersService.find(id)

        if (!user) {
            done(new UnauthorizedException());
        }

        done(null, user);
    }
}
