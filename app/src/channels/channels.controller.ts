import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ConnectedGuard } from 'src/auth/connected.guard';
import { UsersService } from 'src/users/users.service';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';

@Controller('channels')
export class ChannelsController {
	constructor(private readonly channels: ChannelsService, private readonly users: UsersService) {
	}

	@Post()
	@UseGuards(ConnectedGuard)
	async create(@Request() request: any, @Body() createChannelDto: CreateChannelDto): Promise<Channel> {
		const user = await this.users.find(request.user.id)

		return this.channels.create(createChannelDto, user);
	}

	//@Get()
	//findAll() {
	//	return this.channels.findAll();
	//}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.channels.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
		return this.channels.update(+id, updateChannelDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.channels.remove(+id);
	}
}
