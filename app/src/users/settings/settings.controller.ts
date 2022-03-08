import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ConnectedGuard } from "src/auth/connected.guard";
import { User } from "../entities/user.entity";
import { CurrentUser } from "../user.decorator";
import { UsersService } from "../users.service";
import { SetNameDto } from "./settings.dto";

@Controller("/settings")
export class SettingsController {
    constructor(private users: UsersService) {
    }

    @Post("name")
    @UseGuards(ConnectedGuard)
    setName(@CurrentUser() user: User, @Body() input: SetNameDto) {
        user.custom_name = input.name
        this.users.update(user)
    }
}
