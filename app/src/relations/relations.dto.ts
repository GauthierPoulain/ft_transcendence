import { IsEnum, IsNumber } from "class-validator";

export enum RelationAction {
    BLOCK = "block",
    UNBLOCK = "unblock",
    FRIEND = "friend",
    UNFRIEND = "unfriend"
}

export class RelationActionDto {
    @IsNumber()
    targetId: number

    @IsEnum(RelationAction)
    action: RelationAction
}
