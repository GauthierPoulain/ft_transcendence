import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { Repository } from "typeorm"

import { User } from "./entities/user.entity"
import { CreateUserDto } from "./dto/create_user.dto"

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    create(input: CreateUserDto): Promise<User> {
        const user = new User()

        user.intra_id = input.intra_id

        console.log("user", user)
        return this.usersRepository.save(user)
    }

	find(id: string): Promise<User> {
		return this.usersRepository.findOne(id)
	}

    findIntra(intra_id: string): Promise<User> {
		return this.usersRepository.findOne({ where: { intra_id } })
    }
}
