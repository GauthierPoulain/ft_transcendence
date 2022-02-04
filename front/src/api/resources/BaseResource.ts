import { Resource } from "@rest-hooks/rest"

export abstract class BaseResource extends Resource {
	static getFetchInit(init: Readonly<RequestInit>): RequestInit {
	    return {
			...init,
			headers: {
				...init.headers,
				// Access token for user 1, hardcoded lol but better solution later
				'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTY0MzkyNDk1OH0.VtJPJnhEe_duT7CWzYrZlXUWY2prw_SyAKwav91HmLk'
			}
		}
	}
}

export function apiurl(resource: string): string {
	return new URL(`/api/${resource}`, "http://localhost:3005").toString()
}
