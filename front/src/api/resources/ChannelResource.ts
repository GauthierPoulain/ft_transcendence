import { apiurl, BaseResource } from "./BaseResource"
import { UserResource } from "./UserResource"

export class ChannelResource extends BaseResource {
	readonly id: number | undefined = undefined
	readonly name: string = ""
	readonly joinable: boolean = false
	readonly has_password: boolean = false

	pk() {
		return this.id?.toString()
	}

	static urlRoot = apiurl("channels")

	static members<T extends typeof BaseResource>(this: T) {
		return UserResource.list().extend({
			url({ id }) {
				return apiurl(`channels/${id}/members`)
			},
			schema: [UserResource]
		})
	}
}
