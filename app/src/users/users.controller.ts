import { Controller, Get } from "@nestjs/common"
import { UsersService } from "./users.service"

@Controller("users")
export class UsersController {
    constructor(private users: UsersService) {}

    @Get()
    async find() {
        return this.users.findMany();
    }
}
