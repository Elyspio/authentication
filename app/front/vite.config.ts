import { getDefaultConfig } from "@elyspio/vite-eslint-config";
import { defineConfig } from "vite-plus";

// The dev server kept plain HTTP on port 3001 before the vite-plus migration: mkcert stays disabled.
const config = getDefaultConfig({ basePath: import.meta.dirname, port: 3001, useMkcert: false });

export default defineConfig({
	...config,
	build: { outDir: "build" },
	base: "/authentication",
	server: {
		...config.server,
		watch: {
			usePolling: !!process.env.RUNNING_IN_DOCKER,
		},
	},
	fmt: {
		...config.fmt,
		ignorePatterns: [...config.fmt.ignorePatterns, "build/**", "public/**", "src/core/apis/backend/generated.ts"],
	},
	lint: {
		...config.lint,
		ignorePatterns: [...config.lint.ignorePatterns, "build/**", "public/**", "src/core/apis/backend/generated.ts"],
	},
});
