import { BadRequestException, Body, Controller, Get, NotFoundException, Post, UseGuards } from "@nestjs/common";
import { ConnectedGuard } from "src/auth/connected.guard";
import { CurrentUserId } from "src/users/user.decorator";
import { UsersService } from "src/users/users.service";
import { RelationKind } from "./relation.entity";
import { RelationActionDto } from "./relations.dto";
import { RelationsService } from "./relations.service";

@Controller("/relations")
export class RelationsController {
    constructor(private relations: RelationsService, private users: UsersService) {

    }

    @Get()
    @UseGuards(ConnectedGuard)
    async find(@CurrentUserId() userId: number) {
        return this.relations.find({
            where: [
                { current: { id: userId } },
                { target: { id: userId } }
            ]
        })
    }

    @Post()
    @UseGuards(ConnectedGuard)
    async action(@CurrentUserId() userId: number, @Body() body: RelationActionDto) {
        const kind = (body.action === "block" || body.action == "unblock")
            ? RelationKind.BLOCKED
            : RelationKind.FRIEND

        // Creation of a relation.
        if (body.action === "block" || body.action === "friend") {
            // Check if the relation and target already exists.
            const [target, relation] = await Promise.all([
                this.users.find(body.targetId),
                this.relations.get({
                    where: {
                        user: { id: userId },
                        target: { id: body.targetId },
                        kind
                    }
                })
            ])

            if (!target) {
                throw new NotFoundException("target user not found")
            }

            if (relation) {
                throw new BadRequestException("relation already exists")
            }

            await this.relations.create(userId, target.id, kind)
        }
        // Removal of a relation.
        else {
            const relation = await this.relations.get({
                where: {
                    user: { id: userId },
                    target: { id: body.targetId },
                    kind
                }
            })

            if (!relation) {
                throw new NotFoundException("relation not found")
            }

            await this.relations.remove(relation)
        }
    }
}
