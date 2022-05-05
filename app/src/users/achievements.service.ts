import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Injectable()
export class AchievementsService {
    constructor(private users: UsersService) {

    }

    async achieve(userId: number, achievement: string) {
        const user = await this.users.find(userId)

        if (!user.achievements[achievement]) {
            user.achievements[achievement] = true;
            await this.users.update(user)
        }
    }
}
