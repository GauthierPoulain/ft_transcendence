import { Injectable } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import { InjectRepository } from "@nestjs/typeorm"
import { instanceToPlain } from "class-transformer"
import { SocketsService } from "src/sockets/sockets.service"
import { FindManyOptions, FindOneOptions, Repository } from "typeorm"
import { Match, MatchState } from "./match.entity"

@Injectable()
export class MatchesService {
    constructor(
        @InjectRepository(Match) private matches: Repository<Match>,
        private sockets: SocketsService
    ) {
        matches.delete({ state: MatchState.PLAYING })
    }

    async create(match: Match): Promise<Match> {
        match = await this.matches.save(match)

        this.publish("created", instanceToPlain(match, {}))

        return match
    }

    async update(match: Match): Promise<Match> {
        match = await this.matches.save(match)

        this.publish("updated", instanceToPlain(match, {}))

        return match
    }

    get(options: FindOneOptions<Match>): Promise<Match | undefined> {
        return this.matches.findOne(options)
    }

    find(options: FindManyOptions<Match>): Promise<Match[]> {
        return this.matches.find(options)
    }

    async remove(match: Match): Promise<void> {
        const id = match.id
        await this.matches.remove(match)

        this.publish("removed", { id })
    }

    publish(event: string, data: any) {
        this.sockets.publish(["matches"], `matches.${event}`, data)
    }

    @OnEvent("socket.connection")
    async onConnection({ socket }) {
        this.sockets.join(socket, "matches")
    }
}
