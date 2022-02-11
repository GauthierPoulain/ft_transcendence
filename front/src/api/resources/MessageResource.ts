import { AbstractInstanceType } from "@rest-hooks/rest"
import { apiurl, BaseResource } from "./BaseResource"
import { UserResource } from "./UserResource"

export class MessageResource extends BaseResource {
    readonly id: number | undefined = undefined
    readonly content: string = ""
    readonly author: UserResource = UserResource.fromJS({})

    pk() {
        return this.id?.toString()
    }

    static schema = {
        author: UserResource,
    }

    static get key(): string {
        return "MessageResource"
    }

    static url<T extends typeof BaseResource>(
        this: T,
        urlParams: { channelId: number } & Partial<AbstractInstanceType<T>>
    ): string {
        if (urlParams && this.pk(urlParams) !== undefined) {
            return apiurl(
                `channels/${urlParams.channelId}/messages/${this.pk(urlParams)}`
            )
        }

        throw new Error("Message require channelId")
    }

    static listUrl(searchParams: { channelId: number }): string {
        if (searchParams && Object.keys(searchParams).length) {
            const { channelId, ...rest } = searchParams
            const params = new URLSearchParams(rest as any)
            params.sort()
            return apiurl(
                `channels/${channelId}/messages/?${params.toString()}`
            )
        }

        throw new Error("Message require channelId")
    }
}
