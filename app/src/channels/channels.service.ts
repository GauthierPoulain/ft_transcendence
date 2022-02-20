import { forwardRef, Inject, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { hash } from "argon2"
import { Role } from "src/members/member.entity"
import { MembersService } from "src/members/members.service"
import { User } from "src/users/entities/user.entity"
import { Repository } from "typeorm"
import { CreateChannelDto } from "./dto/create-channel.dto"
import { UpdateChannelDto } from "./dto/update-channel.dto"
import { Channel } from "./entities/channel.entity"

@Injectable()
export class ChannelsService {
    constructor(
        @InjectRepository(Channel)
        private channelsRepository: Repository<Channel>,

        @Inject(forwardRef(() => MembersService))
        private members: MembersService
    ) {}

    async create(input: CreateChannelDto, owner: User): Promise<Channel> {
        let channel = new Channel()
        channel.name = input.name
        channel.joinable = input.joinable
        channel.password = input.password ? await hash(input.password) : ""

        channel = await this.channelsRepository.save(channel)

        try {
            await this.members.create(channel, owner, Role.OWNER)
        } catch (e) {
            await this.channelsRepository.remove(channel)
            throw e;
        }

        return channel
    }

    find(options: any): Promise<Channel[]> {
        return this.channelsRepository.find(options)
    }

    findJoinable() {
        return this.channelsRepository.find({ where: { joinable: true } })
    }

    findOne(id: Channel["id"]): Promise<Channel | null> {
        return this.channelsRepository.findOne(id)
    }

    update(id: number, updateChannelDto: UpdateChannelDto) {
        return `This action updates a #${id} channel`
    }

    async remove(id: Channel["id"]): Promise<void> {
        await this.channelsRepository.delete(id)
    }
}
