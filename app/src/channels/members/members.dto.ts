import { IsString } from "class-validator"

export class CreateMemberDto {
    @IsString()
    password: string
}
