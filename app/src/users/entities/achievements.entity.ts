import { Column } from "typeorm";

export class Achievements {
    @Column({ default: false })
    win_one_match: boolean

    @Column({ default: false })
    channel_join: boolean

    @Column({ default: false })
    channel_create: boolean

    @Column({ default: false })
    follow_someone: boolean

    @Column({ default: false })
    block_someone: boolean
}
