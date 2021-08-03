import * as path from "path";
import {Configuration} from "@tsed/common"
import {Helper} from "../core/utils/helper";
import isDev = Helper.isDev;


export const rootDir = path.resolve(__dirname, "..",);

let frontPath = process.env.FRONT_PATH ?? path.resolve(rootDir, "..", "..", "..", "front", "build")

export const webConfig: Partial<Configuration> = {
	rootDir,
	acceptMimes: ['application/json', 'text/plain'],
	httpPort: process.env.HTTP_PORT || 4000,
	httpsPort: false, // CHANGE
	mount: {
		'/api': [
			`${rootDir}/web/controllers/**/*.ts`
		]
	},
	exclude: [
		'**/*.spec.ts'
	],
	statics: {
		'/': [
			{root: frontPath}
		]
	},
	swagger: [{
		path: "/swagger",
		specVersion: "3.0.3",
		operationIdPattern: "%m",
		showExplorer: true,
		options: {
			urls: [
				{
					url: isDev() ? "/swagger/swagger.json" : "/authentication/swagger/swagger.json",
					name: "default"
				}
			]
		}
	}],
	socketIO: {
		cors: {origin: [process.env.BACKEND_HOST ?? "http://localhost:3000"]},
	}

};
