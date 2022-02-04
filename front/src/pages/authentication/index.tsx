import { useMemo } from "react";
import { Routes, Route, useRouteMatch, useLocation, Redirect } from "react-router-dom";
import "./style.css"

function LoginButton() {
	const redirect_uri = new URL("/auth", window.location as any)

	const authorize_uri = new URL("https://api.intra.42.fr/oauth/authorize");
	authorize_uri.searchParams.set("client_id", process.env.REACT_APP_API42UID as string)
	authorize_uri.searchParams.set("redirect_uri", redirect_uri.toString())
	authorize_uri.searchParams.set("response_type", "code")

	function redirect() {
		window.location = authorize_uri.toString() as any
	}

	return (
		<button className="loginbutton" onClick={redirect}>Click to sign in</button>
	);
}

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export function Page() {
	const { path, url } = useRouteMatch();
	const query = useQuery();

	const code = query.get("code")

	return (
		<div className="container">
			<h2>Authentication</h2>
			<img src="/assets/42.jpg" alt="" className="authImg"/><br />
			<Routes>
				<Route path={path} >
					{code ? <Redirect to={{ pathname: `${url}/code` }} /> : <LoginButton />}
				</Route>
				<Route path={`${path}/code`}>
					<p>received authentication code</p>
				</Route>
			</Routes>
		</div>
	)
}
