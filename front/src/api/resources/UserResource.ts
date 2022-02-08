import { apiurl, BaseResource } from "./BaseResource"
import { Resource } from "@rest-hooks/rest"

export class UserResource extends BaseResource {
	readonly id: number | undefined = undefined
	readonly intra_login: string = ""
	readonly intra_image_url: string = ""

	pk() {
		return this.id?.toString()
	}

	static urlRoot = apiurl("users")

	static current<T extends typeof Resource>(this: T) {
		return super.endpoint().extend({
			url() {
				return apiurl("user")
			},
			schema: this
		})
	}
}
