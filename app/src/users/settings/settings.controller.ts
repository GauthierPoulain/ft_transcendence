import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    PayloadTooLargeException,
    Post,
    UnauthorizedException,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { diskStorage } from "multer"
import { generateSecret, verifyToken } from "node-2fa"
import { ConnectedGuard } from "src/auth/connected.guard"
import { QueryFailedError } from "typeorm"
import { User } from "../entities/user.entity"
import { CurrentUser, CurrentUserId } from "../user.decorator"
import { UsersService } from "../users.service"
import { EnableTfaDto, SetNameDto } from "./settings.dto"

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
}

@Controller("/settings")
export class SettingsController {
    constructor(private users: UsersService) {}

    @Post("name")
    @UseGuards(ConnectedGuard)
    async setName(@CurrentUser() user: User, @Body() input: SetNameDto) {
        // Transform empty string to null (to remove custom_name)
        user.custom_name = input.name ? input.name : null

        try {
            await this.users.update(user)
        } catch (error) {
            // Check if the error was caused by a duplicate usage of the name
            if (
                error instanceof QueryFailedError &&
                error.message.includes(
                    "duplicate key value violates unique constraint"
                )
            ) {
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

    // TODO: Check if the file is valid (mimetype and max size)
    @Post("avatar")
    @UseGuards(ConnectedGuard)
    @UseInterceptors(
        FileInterceptor("avatar", {
            storage: diskStorage({
                destination(_req, _file, cb) {
                    cb(null, "/srv/avatars")
                },

                filename(_req, file, cb) {
                    cb(
                        null,
                        `${file.fieldname}-${Date.now()}-${Math.round(
                            Math.random() * 1e9
                        )}.${MIME_TYPE_MAP[file.mimetype]}`
                    )
                },
            }),

            fileFilter(_req, file, cb) {
                if (file.size > (2 * 1024 * 1024)) {
                    return cb(new PayloadTooLargeException("The file is too big"), false);
                }

                if (!MIME_TYPE_MAP[file.mimetype]) {
                    return cb(new BadRequestException("This type of file is not allowed for an avatar"), false);
                }

                return cb(null, true);
            }
        })
    )
    async uploadAvatar(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser() user: User
    ) {
        if (file) {
            user.custom_image = file.filename
            await this.users.update(user)
        }
    }

    @Delete("avatar")
    @UseGuards(ConnectedGuard)
    async removeAvatar(@CurrentUser() user: User) {
        user.custom_image = null
        await this.users.update(user)
    }
}
