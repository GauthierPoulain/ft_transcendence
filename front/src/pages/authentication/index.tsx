import { useEffect, useMemo } from "react";
import { Container, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { apiurl, BaseResource } from "../../api/resources/BaseResource";
import "./style.css"

const redirect_uri = new URL("/auth", window.location as any).toString()

const authorize_uri = new URL("https://api.intra.42.fr/oauth/authorize");
authorize_uri.searchParams.set("client_id", process.env.REACT_APP_API42UID as string)
authorize_uri.searchParams.set("redirect_uri", redirect_uri)
authorize_uri.searchParams.set("response_type", "code")

function redirect() {
	window.location = authorize_uri.toString() as any
}

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export function Page() {
	const query = useQuery();
	const code = query.get("code")
	const navigate = useNavigate()
	const isLoading = !!code

	useEffect(() => {
		const login = async (code: string) => {
			const response = await fetch(apiurl("auth/login"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					code,
					redirect_uri
				})
			})
			const json = await response.json()

			console.log(json)
			BaseResource.accessToken = json.token

			navigate("/", { replace: true })
		}

		if (isLoading) {
			login(code)
				.catch(console.error.bind(console))
		}
	}, [])

	return (
		<Container>
			<h1>Authentication</h1>

			<p>You will be redirected to the 42 intranet.</p>

			<Button variant="primary" disabled={isLoading} onClick={isLoading ? null : redirect}>
				{isLoading ? "Loading..." : "Sign in"}
			</Button>
		</Container>
	)
}
