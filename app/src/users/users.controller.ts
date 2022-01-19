import { Controller, Get, Request, UseGuards } from "@nestjs/common"
import { User } from "./entities/user.entity"
import { ConnectedGuard } from "src/auth/guards/connected.guard"

@Controller("users")
export class UsersController {
    @UseGuards(ConnectedGuard)
	@Get("me")
	me(@Request() request: any): Promise<User> {
		return request.user
	}
}
