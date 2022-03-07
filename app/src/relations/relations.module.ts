import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { Relation } from "./relation.entity";
import { RelationsController } from "./relations.controller";
import { RelationsService } from "./relations.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ Relation ]),
        UsersModule
    ],
    providers: [RelationsService],
    controllers: [RelationsController],
    exports: [RelationsService]
})
export class RelationsModule {
}
