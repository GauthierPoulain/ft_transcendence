import { IsEnum, IsNumber, IsString } from "class-validator"

export class CreateMemberDto {
    @IsNumber()
    channelId: number

    @IsString()
    password: string
}

export enum UpdateMemberAction {
    PROMOTE = "promote",
    DEMOTE = "demote",
    MUTE = "mute",
    UNMUTE = "unmute"
}

export class UpdateMemberDto {
    @IsEnum(UpdateMemberAction)
    action: UpdateMemberAction
}
