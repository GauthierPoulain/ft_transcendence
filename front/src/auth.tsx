import { createContext, useContext, useState } from "react";
import { apiurl, BaseResource } from "./api/resources/BaseResource"

interface AuthContextType {
	connected: boolean,
	redirectIntra: () => void;
	exchangeCode: (code: string) => Promise<string>;
	signin: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

const redirect_uri = new URL("/auth", window.location as any).toString()

export function AuthProvider({ children }) {
	const [connected, setConnected] = useState(false)

	const redirectIntra = () => {
		const authorize_uri = new URL("https://api.intra.42.fr/oauth/authorize");
		authorize_uri.searchParams.set("client_id", process.env.REACT_APP_API42UID as string)
		authorize_uri.searchParams.set("redirect_uri", redirect_uri)
		authorize_uri.searchParams.set("response_type", "code")

		window.location = authorize_uri.toString() as any
	}

	const exchangeCode = async (code: string) => {
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

		return json.token
	}

	const signin = (token: string) => {
		console.log("signin", token)
		BaseResource.accessToken = token
		setConnected(true)
	}

	const value = { connected, redirectIntra, exchangeCode, signin };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	return useContext(AuthContext)
}
