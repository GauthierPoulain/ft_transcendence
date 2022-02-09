import { Controller, Get, Param, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConnectedGuard } from "src/auth/connected.guard";
import { User } from "src/users/entities/user.entity";
import { CurrentUser } from "src/users/user.decorator";
import { ChannelsService } from "./channels.service";

@Controller("channels/:channelId/members")
export class MembersController {
	constructor(private channels: ChannelsService) {
	}

	@Get()
	@UseGuards(ConnectedGuard)
	async findAll(@CurrentUser() user: User, @Param("channelId") channelId: number) {
		const channel = await this.channels.findOne(channelId, ["members"])

		if (!channel || !channel.members.some(({ id }) => id === user.id)) {
			throw new UnauthorizedException;
		}

		return channel.members
	}
}
