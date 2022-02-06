import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { ConnectedGuard } from "src/auth/connected.guard";
import { Channel } from "src/channels/entities/channel.entity";
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

	@UseGuards(ConnectedGuard)
	@Get("channels")
	async channels(@Request() request: any): Promise<Channel[]> {
		const user = await this.users.find(request.user.id, ["channels"])

		console.log(user.channels)

		return user.channels
	}
}
