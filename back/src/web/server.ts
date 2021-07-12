import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/swagger";
import {webConfig} from "../config/web";
import {middlewares} from "./middleware/raw";

@Configuration(webConfig)
export class Server {

	@Inject()
	app: PlatformApplication;

	@Configuration()
	settings: Configuration;

	$beforeRoutesInit() {
		this.app.use(...middlewares)
		return null;
	}
}
