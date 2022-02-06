import { apiurl, BaseResource } from "./BaseResource"

export class ChannelResource extends BaseResource {
	readonly id: number
	readonly name: string
	readonly joinable: boolean
	readonly has_password: boolean

	pk() {
		return this.id.toString()
	}

	static urlRoot = apiurl("channels")
}
