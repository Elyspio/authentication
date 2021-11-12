import * as path from "path";
import * as process from "process";
import { Configuration } from "@tsed/common";
import { Helper } from "../core/utils/helper";
import isDev = Helper.isDev;

export const rootDir = path.resolve(__dirname, "..");

export let frontPath = process.env.FRONT_PATH ?? path.resolve(rootDir, "..", "..", "..", "front", "build");

export const webConfig: Partial<Configuration> = {
	rootDir,
	acceptMimes: ["application/json", "text/plain "],
	httpPort: process.env.HTTP_PORT || 4000,
	httpsPort: false, // CHANGE
	mount: {
		"/api": [`${rootDir}/web/controllers/**/*.ts`],
	},
	componentsScan: [`${rootDir}/core/**/*.ts`],
	exclude: ["**/*.spec.ts", "**/*.d.ts"],
	statics: {
		"/": [{ root: frontPath }],
	},
	swagger: [
		{
			path: "/swagger",
			options: {
				urls: [
					{
						name: process.env.NODE_ENV?.toString() ?? "development",
						url: isDev() ? "http://localhost:4001/swagger/swagger.json" : "https://elyspio.fr/authentication/swagger/swagger.json",
					},
				],
			},
			spec: {
				servers: [
					{
						description: process.env.NODE_ENV?.toString() ?? "development",
						url: isDev() ? "http://localhost:4001" : "https://elyspio.fr/authentication",
					},
				],
			},
			specVersion: "3.0.1",
			operationIdPattern: "%m",
		},
	]
};
