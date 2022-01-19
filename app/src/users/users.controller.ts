import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";

@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get("me")
    me(): User {
        return this.usersService.findOne(0);
    }
}
