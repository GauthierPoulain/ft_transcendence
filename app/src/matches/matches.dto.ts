import { IsBoolean, IsNumber } from "class-validator"

export class CreateMatchDto {
    @IsNumber()
    opponent: number

    @IsBoolean()
    powerups: boolean
}
