import { apiurl, BaseResource } from "./BaseResource"

export class UserResource extends BaseResource {
    readonly id: number | undefined = undefined
    readonly nickname: string = ""
    readonly image: string = ""

    pk() {
        return this.id?.toString()
    }

    static urlRoot = apiurl("users")
}
