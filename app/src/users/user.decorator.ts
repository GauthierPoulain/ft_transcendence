import { ArgumentMetadata, createParamDecorator, ExecutionContext, Injectable, PipeTransform } from "@nestjs/common";
import { User as UserEntity } from "./entities/user.entity";
import { UsersService } from "./users.service";

@Injectable()
export class FetchUserPipe implements PipeTransform<number, Promise<UserEntity>> {
	constructor(private users: UsersService) {
	}

	async transform(value: number, metadata: ArgumentMetadata) {
		// metadata.data should be a string but typing is a joke and we can have an array here.
		// metadata.data is the relations we want to fetch.

		return this.users.find(value, metadata.data as any as string[])
	}
}

export const CurrentUserId = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	return ctx.switchToHttp().getRequest().user.id
})

export const CurrentUser = (relations = []) => CurrentUserId(relations, FetchUserPipe)
