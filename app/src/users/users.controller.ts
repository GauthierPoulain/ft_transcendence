import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Request,
    UseGuards,
} from "@nestjs/common";
import { User } from "./entities/user.entity";
import { ConnectedGuard } from "src/auth/connected.guard";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    constructor(private users: UsersService) {}

    @UseGuards(ConnectedGuard)
    @Get("me")
    me(@Request() request: any): Promise<User> {
        return this.users.find(request.user.id);
    }

    @Get(":id")
    getUserById(@Param("id") id: string) {
        return this.users
            .find(id)
            .then((user) => {
                return {
                    id: user.id,
                    nickname: this.users.getNickname(user),
                    image: this.users.getImage(user),
                };
            })
            .catch((e) => {
                console.log(e);
                throw new NotFoundException();
            });
    }
}
