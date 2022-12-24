import { Configuration, Inject } from "@tsed/di";
import { AfterRoutesInit, BeforeRoutesInit, PlatformApplication } from "@tsed/common";
import "@tsed/swagger";
import { frontPath, webConfig } from "../config/web";
import { middlewares } from "./middleware/raw";
import { databaseConfig } from "../config/db";
import { Response } from "express";
import * as path from "path";

@Configuration({ ...webConfig, typeorm: databaseConfig })
export class Server implements AfterRoutesInit, BeforeRoutesInit {
	@Inject()
	app!: PlatformApplication;

	@Configuration()
	settings!: Configuration;

	$beforeRoutesInit() {
		this.app.use(...middlewares);
	}

	$afterRoutesInit() {
		this.app.use("*", (req: any, res: Response) => {
			res.sendFile(path.join(frontPath, "index.html"));
		});
	}
}
