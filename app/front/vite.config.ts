import { getDefaultConfig } from "@elyspio/vite-eslint-config";
import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, type PluginOption } from "vite-plus";

// The dev server kept plain HTTP on port 3001 before the vite-plus migration: mkcert stays disabled.
const config = getDefaultConfig({ basePath: import.meta.dirname, port: 3001, useMkcert: false });

// The shared config runs the React Compiler through Babel, which cannot parse the legacy decorators
// used by the inversify services: swap that pass for one that enables the `decorators-legacy` syntax.
const isBabelPlugin = (plugin: Awaited<PluginOption>) => !!plugin && "name" in plugin && plugin.name === "@rolldown/plugin-babel";
const plugins = (await Promise.all(config.plugins)).filter((plugin) => !isBabelPlugin(plugin));
plugins.push(
	babel({
		presets: [reactCompilerPreset()],
		// Babel merges parser plugins per override: restate the TypeScript/JSX ones next to decorators-legacy.
		overrides: [
			{ test: /\.ts(?:$|\?)/, parserOpts: { plugins: ["typescript", "decorators-legacy"] } },
			{ test: /\.tsx(?:$|\?)/, parserOpts: { plugins: ["typescript", "jsx", "decorators-legacy"] } },
		],
	})
);

export default defineConfig({
	...config,
	plugins,
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
