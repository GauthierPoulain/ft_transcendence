import { Exclude } from "class-transformer"
import { User } from "src/users/entities/user.entity"
import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from "typeorm"

export enum MatchState {
    // If we're waiting for both players to accept the game.
    WAITING = "waiting",

    // If the game is currently running.
    PLAYING = "playing",

    PLAYER_ONE_WON = "player_one_won",
    PLAYER_TWO_WON = "player_two_won",
}

// TODO: Add score and maybe win reason
@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.matchesPlayerOne)
    @Exclude()
    playerOne: User

    @RelationId((match: Match) => match.playerOne)
    playerOneId: number

    @ManyToOne(() => User, (user) => user.matchesPlayerTwo)
    @Exclude()
    playerTwo: User

    @RelationId((match: Match) => match.playerTwo)
    playerTwoId: number

    // If the game was started through matchmaking
    @Column({ default: false })
    matchmaking: boolean

    @Column({ default: 0 })
    scorePOne: number

    @Column({ default: 0 })
    scorePTwo: number

    @Column({
        type: "enum",
        enum: MatchState,
        default: MatchState.WAITING,
    })
    state: MatchState
}
