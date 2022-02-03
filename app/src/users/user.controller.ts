import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { ConnectedGuard } from "src/auth/connected.guard";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

// Controller for the current user.

@Controller("user")
export class UserController {
	constructor(private users: UsersService) {
	}

	@UseGuards(ConnectedGuard)
	@Get()
    me(@Request() request: any): Promise<User> {
        return this.users.find(request.user.id);
    }
}
