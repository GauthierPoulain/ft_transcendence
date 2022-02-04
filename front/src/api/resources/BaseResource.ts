import { Resource } from "@rest-hooks/rest"

export abstract class BaseResource extends Resource {
	static accessToken?: string;

	static getFetchInit(init: Readonly<RequestInit>): RequestInit {
	    return {
			...init,
			headers: {
				...init.headers,

				...(BaseResource.accessToken ? {'Authorization': `Bearer ${BaseResource.accessToken}`} : {})
			}
		}
	}
}

export function apiurl(resource: string): string {
	return new URL(`/api/${resource}`, "http://localhost:3005").toString()
}
