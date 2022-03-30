import { IsNumber } from "class-validator";

export class GameWaitingDto {
    @IsNumber()
    id: number
}
