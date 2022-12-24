import "reflect-metadata";
import "@tsed/platform-express"; // /!\ keep this import
import { PlatformExpress } from "@tsed/platform-express";
import { Server } from "./web/server";
import { getLogger } from "./core/utils/logger";
import { webConfig } from "./config/web";

if (require.main === module) {
	bootstrap();
}

async function bootstrap() {
	const logger = getLogger.default();

	try {
		logger.debug("Start server...");
		const platform = await PlatformExpress.bootstrap(Server, {});

		await platform.listen();
		logger.debug(`Server initialized swagger-ui: http://localhost:${webConfig.httpPort}/swagger`);
	} catch (er) {
		logger.error(er);
	}
}
