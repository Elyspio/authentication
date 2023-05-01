import { getDefaultConfig } from "@elyspio/vite-eslint-config/vite/vite.config";
import { defineConfig } from "vite";

const config = getDefaultConfig(__dirname);

export default defineConfig((env) => ({
	...config,
	base: "/authentication",
	server: {
		...config.server,
		port: 3001,
		watch: {
			...(config.server?.watch ?? {}),
			usePolling: !!process.env.RUNNING_IN_DOCKER,
		},
	},
}));
