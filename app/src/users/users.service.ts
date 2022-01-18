import { Injectable } from "@nestjs/common"
import { User } from "./entities/user.entity"

@Injectable()
export class UsersService {
	public users: User[] = [
		{
			id: 0,
			username: "Azerty"
		},
		{
			id: 1,
			username: "Qwerty"
		}
	]

	findOne(id: number): User {
		return this.users[id]
	}
}
