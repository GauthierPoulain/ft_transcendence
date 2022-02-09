import { IsBoolean, IsString } from "class-validator"
import { Transform } from "class-transformer"

export class CreateMessageDto {
	@IsString()
	content: string
}

export class QueryChannelsDto {
	@IsBoolean()
	@Transform(({ value }) => {
		if (value === "true") return true;
		if (value === "false") return false;
		return value
	})
	joined: boolean
}
