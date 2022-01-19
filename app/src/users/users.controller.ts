import { Controller, Get, Session } from "@nestjs/common"
import { UsersService } from "./users.service"
import { User } from "./entities/user.entity"

@Controller("users")
export class UsersController {
    constructor(private usersService: UsersService) {}

	@Get("me")
	me(@Session() session: Record<string, any>): Promise<User> {
		return this.usersService.find(session.user)
	}
}
