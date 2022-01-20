import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create_user.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    create(input: CreateUserDto): Promise<User> {
        const user = new User();

        user.intra_id = input.intra_id;
        user.intra_login = input.intra_login;
        user.intra_image_url = input.intra_image_url;

        console.log("user", user);
        return this.usersRepository.save(user);
    }

    async updateIntra(id: number, input: CreateUserDto): Promise<User> {
        const user: User = {
            id: id,
            intra_id: input.intra_id,
            intra_login: input.intra_login,
            intra_image_url: input.intra_image_url,
        };

        this.usersRepository.save(user);
        return this.usersRepository.save(user);
    }

    find(id: string): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    findIntra(intra_id: string): Promise<User> {
        return this.usersRepository.findOne({ where: { intra_id } });
    }
}
