import { Controller, Get, UseGuards } from "@nestjs/common"
import { ConnectedGuard } from "src/auth/connected.guard"
import { User } from "./entities/user.entity"
import { CurrentUser } from "./user.decorator"

// Controller for the current user.

@Controller("user")
export class UserController {
    @Get()
    @UseGuards(ConnectedGuard)
    me(@CurrentUser() user: User): User {
        return user
    }
}
