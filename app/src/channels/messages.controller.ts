import { Body, Controller, Get, Param, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConnectedGuard } from "src/auth/connected.guard";
import { User } from "src/users/entities/user.entity";
import { CurrentUser } from "src/users/user.decorator";
import { CreateMessageDto } from "./channels.dto";
import { ChannelsService } from "./channels.service";

@Controller("channels/:channelId/messages")
export class MessagesController {
	constructor(private channels: ChannelsService) {
	}

	@Get()
	@UseGuards(ConnectedGuard)
	async findAll(@CurrentUser() user: User, @Param("channelId") channelId: number) {
		console.log("user", user)
		//const channel = await this.channels.findOne(channelId, ["members", "messages"])

		//if (!channel || !channel.members.some(({ id }) => id == request.user.id)) {
		//	throw new UnauthorizedException;
		//}

		//console.log(channel)
		//console.log(request.user)
	}

	@Post()
	@UseGuards(ConnectedGuard)
	async create(@CurrentUser() user: User, @Param("channelId") channelId: number, @Body() body: CreateMessageDto) {
		const channel = await this.channels.findOne(channelId, ["members"])

		if (!channel || !channel.members.some(({ id }) => id == user.id)) {
			throw new UnauthorizedException;
		}

		await this.channels.createMessage(channel, user, body)
	}
}
