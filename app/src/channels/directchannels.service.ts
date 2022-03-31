import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "src/users/entities/user.entity"
import { Repository } from "typeorm"
import { ChannelsService } from "./channels.service"
import { Channel, DirectChannel } from "./entities/channel.entity"

@Injectable()
export class DirectChannelsService {
    constructor(
        @InjectRepository(DirectChannel)
        private repository: Repository<DirectChannel>,

        private channels: ChannelsService
    ) {}

    async create(userOne: User, userTwo: User): Promise<Channel> {
        let direct = await this.repository.findOne({
            where: [
                { userOne: { id: userOne.id }, userTwo: { id: userTwo.id } },
                { userOne: { id: userTwo.id }, userTwo: { id: userOne.id } },
            ],
            relations: ["channel"],
        })

        if (direct) {
            return direct.channel
        }

        const channel = await this.channels.createComplex(
            `${userOne.nickname} & ${userTwo.nickname}`,
            false,
            "",
            true,
            [userOne, userTwo]
        )

        direct = new DirectChannel()
        direct.channel = channel
        direct.userOne = userOne
        direct.userTwo = userTwo
        await this.repository.save(direct)
        return channel
    }
}
