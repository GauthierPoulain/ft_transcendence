import { IsNumber, IsString } from "class-validator"

export class CreateMemberDto {
    @IsNumber()
    channelId: number

    @IsString()
    password: string
}
