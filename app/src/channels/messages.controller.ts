import { Body, Controller, Get, Param, Post, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConnectedGuard } from "src/auth/connected.guard";
import { UsersService } from "src/users/users.service";
import { CreateMessageDto } from "./channels.dto";
import { ChannelsService } from "./channels.service";

@Controller("channels/:channelId/messages")
export class MessagesController {
	constructor(private channels: ChannelsService, private users: UsersService) {
	}

	@Get()
	@UseGuards(ConnectedGuard)
	async findAll(@Request() request: any, @Param("channelId") channelId: number) {
		const channel = await this.channels.findOne(channelId, ["members", "messages"])

		if (!channel || !channel.members.some(({ id }) => id == request.user.id)) {
			throw new UnauthorizedException;
		}

		console.log(channel)
		console.log(request.user)
	}

	@Post()
	@UseGuards(ConnectedGuard)
	async create(@Request() request: any, @Param("channelId") channelId: number, @Body() body: CreateMessageDto) {
		const channel = await this.channels.findOne(channelId, ["members"])

		if (!channel || !channel.members.some(({ id }) => id == request.user.id)) {
			throw new UnauthorizedException;
		}

		const user = await this.users.find(request.user.id)

		await this.channels.createMessage(channel, user, body)
	}
}
