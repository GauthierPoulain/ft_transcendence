import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {
	constructor(
        @InjectRepository(Channel)
        private channelsRepository: Repository<Channel>
	) { }

	async create(input: CreateChannelDto, owner: User): Promise<Channel> {
		const channel = new Channel()

		channel.name = input.name
		channel.joinable = input.joinable
		channel.password = input.password ? await hash(input.password) : ""
		channel.owner = owner
		channel.admins = [owner]
		channel.members = [owner]
		channel.messages = []

		return this.channelsRepository.save(channel)
	}

	findJoinable() {
		return this.channelsRepository.find({ where: { joinable: true } })
	}

	findOne(id: number) {
		return `This action returns a #${id} channel`;
	}

	update(id: number, updateChannelDto: UpdateChannelDto) {
		return `This action updates a #${id} channel`;
	}

	remove(id: number) {
		return `This action removes a #${id} channel`;
	}
}
