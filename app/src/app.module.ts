import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EventsModule } from "./events/events.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";

import { User } from "./users/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            // TODO: Make them configurable.
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "postgres",
            database: "ft_transcendance",

            // TODO: This can destroy production data, so we may want to remove this in the future.
            synchronize: true,

            entities: [
                User
            ],
        }),
        EventsModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
