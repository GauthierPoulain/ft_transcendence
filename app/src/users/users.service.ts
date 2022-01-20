import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { User } from "./entities/user.entity";
import { IntraInfosDto } from "./dto/intra_infos.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    create(input: IntraInfosDto): Promise<User> {
        const user = new User();

        user.intra_id = input.id;
        user.intra_login = input.login;
        user.intra_image_url = input.image_url;

        console.log("user", user);
        return this.usersRepository.save(user);
    }

    async updateIntra(user: User, intra_user: IntraInfosDto) {
        user.intra_id = intra_user.id
        user.intra_login = intra_user.login
        user.intra_image_url = intra_user.image_url

        await this.usersRepository.save(user);
    }

    find(id: string): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    findIntra(intra_id: string): Promise<User> {
        return this.usersRepository.findOne({ where: { intra_id } });
    }
}
