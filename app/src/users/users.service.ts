import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"

import { Repository } from "typeorm"

import { User } from "./entities/user.entity"
import { IntraInfosDto } from "./dto/intra_infos.dto"

import * as tfa from "node-2fa"
import { SocketsService } from "src/sockets/sockets.service"
import { instanceToPlain } from "class-transformer"

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        private sockets: SocketsService
    ) {}

    async create(input: IntraInfosDto): Promise<User> {
        let user = new User()
        user.intra_id = input.id
        user.intra_login = input.login
        user.intra_image_url = input.image_url
        user = await this.usersRepository.save(user)

        this.publish("created", instanceToPlain(user, {}))

        return user
    }

    async update(user: User) {
        user = await this.usersRepository.save(user)
        this.publish("updated", instanceToPlain(user, {}))
    }

    updateIntra(user: User, intra_user: IntraInfosDto) {
        user.intra_id = intra_user.id
        user.intra_login = intra_user.login
        user.intra_image_url = intra_user.image_url

        return this.usersRepository.save(user)
    }

    findMany(): Promise<User[]> {
        return this.usersRepository.find();
    }

    find(id: number, relations = []): Promise<User> {
        return this.usersRepository.findOne(id, { relations })
    }

    findIntra(intra_id: number): Promise<User> {
        return this.usersRepository.findOne({ where: { intra_id } })
    }

    enable2fa(user: User, refreshToken: boolean = false) {
        if (user.tfa_secret == "" || refreshToken) {
            user.tfa_secret = tfa.generateSecret().secret
            return this.usersRepository.save(user)
        } else return user
    }

    get2faQr(user: User) {
        const app_name = "ft_transcendance"
        const size = 250

        return `https://chart.googleapis.com/chart?chs=${size}x${size}&chld=L|0&cht=qr&chl=otpauth://totp/${app_name}:${user.intra_login}%3Fsecret=${user.tfa_secret}%26issuer=${app_name}`
    }

    disable2fa(user: User) {
        user.tfa_secret = ""
        return this.usersRepository.save(user)
    }

    check2fa(user: User, token: string) {
        if (user.tfa_secret == "") return true
        const result = tfa.verifyToken(user.tfa_secret, token)
        return result != null && result.delta > -2
    }

    user42Login(user: User) {
        return this.usersRepository.save(user)
    }

    private publish(event: string, data: any) {
        this.sockets.publish(["all"], `users.${event}`, data)
    }
}
