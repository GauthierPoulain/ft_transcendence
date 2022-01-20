import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    intra_id: string;

    @Column()
    intra_login: string;

    @Column()
    intra_image_url: string;

    @Column({ default: false })
    use_tfa: boolean;

    @Column({ default: "" })
    tfa_secret: string;
}
