import { BadRequestException, Body, Controller, Delete, Get, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { generateSecret, verifyToken } from "node-2fa";
import { ConnectedGuard } from "src/auth/connected.guard";
import { QueryFailedError } from "typeorm";
import { User } from "../entities/user.entity";
import { CurrentUser, CurrentUserId } from "../user.decorator";
import { UsersService } from "../users.service";
import { EnableTfaDto, SetNameDto } from "./settings.dto";

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

    // Get a random secret to enable 2FA
    @Get("tfa")
    @UseGuards(ConnectedGuard)
    async tfaSecret(@CurrentUserId() userId: number) {
        return generateSecret({ name: "ft_pong", account: userId.toString() })
    }

    @Post("tfa")
    @UseGuards(ConnectedGuard)
    async enableTfa(@CurrentUser() user: User, @Body() body: EnableTfaDto) {
        // Can't re-enable tfa if already enabled.
        if (user.tfa) {
            throw new BadRequestException()
        }

        const result = verifyToken(body.secret, body.token)

        // The token is invalid or is out of sync.
        if (!result || result.delta !== 0) {
            throw new UnauthorizedException()
        }

        user.tfa_secret = body.secret
        await this.users.update(user)
    }

    @Delete("tfa")
    @UseGuards(ConnectedGuard)
    async disableTfa(@CurrentUser() user: User) {
        // Can't disable something that is not enabled.
        if (!user.tfa) {
            throw new BadRequestException()
        }

        user.tfa_secret = null
        await this.users.update(user)
    }
}
