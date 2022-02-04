import { useEffect, useMemo } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { apiurl, BaseResource } from "../../api/resources/BaseResource";
import { useAuth } from "../../auth";
import "./style.css"


function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export function Page() {
	const query = useQuery();
	const code = query.get("code")
	const navigate = useNavigate()
	const isLoading = !!code
	const auth = useAuth()

	useEffect(() => {
		const login = async (code: string) => {
			const token = await auth.exchangeCode(code)

			auth.signin(token)
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

			<Alert variant="danger">
				An error occured while we were trying to connect you.
			</Alert>

			<p>You will be redirected to the 42 intranet.</p>

			<Button variant="primary" disabled={isLoading} onClick={isLoading ? null : auth.redirectIntra}>
				{isLoading ? "Loading..." : "Sign in"}
			</Button>
		</Container>
	)
}
