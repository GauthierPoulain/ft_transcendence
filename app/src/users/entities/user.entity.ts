import { Achievements } from "../../achievements/entities/achievements.entity";

export class User {
    id: number;

    username: string;

    achievements: Achievements;
}
