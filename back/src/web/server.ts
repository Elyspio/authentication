import { Configuration, Inject } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import "@tsed/swagger";
import { webConfig } from "../config/web";
import { middlewares } from "./middleware/raw";
import { databaseConfig } from "../config/db";

@Configuration({ ...webConfig, typeorm: databaseConfig })
export class Server {
	@Inject()
	app!: PlatformApplication;

	@Configuration()
	settings!: Configuration;

	$beforeRoutesInit() {
		this.app.use(...middlewares);
		return null;
	}
}
