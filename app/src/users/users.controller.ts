import { Controller, Get, NotFoundException, Param } from "@nestjs/common"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
    constructor(private users: UsersService) {}

    @Get(":id")
    async findOne(@Param("id") id: number) {
        const user = await this.users.find(id)
        if (!user) {
            throw new NotFoundException()
        }
        return this.users.getPublicUser(user)
    }
}
