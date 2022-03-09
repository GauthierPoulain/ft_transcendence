import { IsString } from "class-validator";

export class SetNameDto {
    @IsString()
    name: string
}

export class EnableTfaDto {
    @IsString()
    secret: string

    @IsString()
    token: string
}
