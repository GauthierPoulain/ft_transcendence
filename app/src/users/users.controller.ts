import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { ConnectedGuard } from "src/auth/connected.guard";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    constructor(private users: UsersService) {
    }

    @UseGuards(ConnectedGuard)
    @Get("me")
    me(@Request() request: any): Promise<User> {
        return this.users.find(request.user.id)
    }
}
