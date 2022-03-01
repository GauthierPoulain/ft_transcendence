import { forwardRef, Inject, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { hash } from "argon2"
import { instanceToPlain } from "class-transformer"
import { Role } from "src/members/member.entity"
import { MembersService } from "src/members/members.service"
import { SocketsService } from "src/sockets/sockets.service"
import { User } from "src/users/entities/user.entity"
import { FindManyOptions, Repository } from "typeorm"
import { CreateChannelDto } from "./dto/create-channel.dto"
import { Channel } from "./entities/channel.entity"

@Injectable()
export class ChannelsService {
    constructor(
        @InjectRepository(Channel)
        private channelsRepository: Repository<Channel>,

        @Inject(forwardRef(() => MembersService))
        private members: MembersService,

        private sockets: SocketsService
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
            throw e
        }

        this.publish("created", instanceToPlain(channel, {}))

        return channel
    }

    find(options: FindManyOptions<Channel>): Promise<Channel[]> {
        return this.channelsRepository.find(options)
    }

    findJoinable() {
        return this.channelsRepository.find({ where: { joinable: true } })
    }

    findOne(id: Channel["id"]): Promise<Channel | null> {
        return this.channelsRepository.findOne(id)
    }

    async remove(id: Channel["id"]): Promise<void> {
        await this.channelsRepository.delete(id)
        this.publish("removed", { id })
    }

    private publish(event: string, data: any) {
        this.sockets.publish(["all"], `channels.${event}`, data)
    }
}
