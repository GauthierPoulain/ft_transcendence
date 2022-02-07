import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConnectedGuard } from 'src/auth/connected.guard';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/users/user.decorator';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';

@Controller('channels')
export class ChannelsController {
	constructor(private readonly channels: ChannelsService) {
	}

	@Post()
	@UseGuards(ConnectedGuard)
	async create(@CurrentUser() user: User, @Body() createChannelDto: CreateChannelDto): Promise<Channel> {
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
