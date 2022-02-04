import {
    Controller,
    Get,
    NotFoundException,
    Param,
} from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    constructor(private users: UsersService) {}

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
