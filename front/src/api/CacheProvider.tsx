import { CacheProvider as InnerCacheProvider, NetworkManager } from '@rest-hooks/core';
import StreamManager from "./stream-manager"

export default function CacheProvider({ children }) {
	const managers = [
		new NetworkManager(),
		new StreamManager("ws://localhost:3005")
	];

	return <InnerCacheProvider managers={managers}>{children}</InnerCacheProvider>
}
