import { apiurl, BaseResource } from "./BaseResource"

export class UserResource extends BaseResource {
    readonly id: number | undefined = undefined
    readonly intra_login: string = ""
    readonly intra_image_url: string = ""

    pk() {
        return this.id?.toString()
    }

    static urlRoot = apiurl("users")
}
