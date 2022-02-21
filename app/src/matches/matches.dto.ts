import { IsNumber } from "class-validator"

export class CreateMatchDto {
    @IsNumber()
    opponent: number
}
