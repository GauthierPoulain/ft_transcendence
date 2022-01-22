import { Channel } from "src/channels/entities/channel.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from "typeorm";

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

    @Column({ default: "" })
    tfa_secret: string;

    @Column({ default: "" })
    image_seed: string;

    @Column({ default: "" })
    nickname: string;

    // Channels where the user is at least an administrator
    @ManyToMany(() => Channel, (channel) => channel.admins)
    admin_channels: Channel[];

    // Channels where the user is at least a member
    @ManyToMany(() => Channel, (channel) => channel.members)
    channels: Channel[];
}
