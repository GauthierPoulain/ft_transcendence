import { BadRequestException, Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ConnectedGuard } from "src/auth/connected.guard";
import { QueryFailedError } from "typeorm";
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
    async setName(@CurrentUser() user: User, @Body() input: SetNameDto) {
        // Transform empty string to null (to remove custom_name)
        user.custom_name = input.name ? input.name : null

        try {
            await this.users.update(user)
        } catch (error) {
            // Check if the error was caused by a duplicate usage of the name
            if (error instanceof QueryFailedError && error.message.includes("duplicate key value violates unique constraint")) {
                throw new BadRequestException("custom name already taken")                
            }

            throw error
        }
    }
}
