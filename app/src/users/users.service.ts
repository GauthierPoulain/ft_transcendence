import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
    public users: User[] = [
        {
            id: 0,
            username: "Azerty",
            achievements: {
                reverse_engineer: 0,
            },
        },
        {
            id: 1,
            username: "Qwerty",
            achievements: {
                reverse_engineer: 0,
            },
        },
    ];

    findOne(id: number): User {
        return this.users[id];
    }
}
