import { Injectable } from "@nestjs/common";
import { Achievements } from "./entities/achievements.entity";
import { UsersService } from "./users.service";

@Injectable()
export class AchievementsService {
    constructor(private users: UsersService) {

    }

    async achieve(userId: number, achievement: keyof Achievements) {
        const user = await this.users.find(userId)

        if (user && !user.achievements[achievement]) {
            user.achievements[achievement] = true
            await this.users.update(user)
        }
    }
}
