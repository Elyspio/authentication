import { BodyParams, Controller, Delete, Get, PathParams, Post, Req } from "@tsed/common";
import { AuthenticationService } from "../../../core/services/authentication/authentication.service";
import { Request } from "express";
import { Name, Required, Returns } from "@tsed/schema";
import { getLogger } from "../../../core/utils/logger";
import { Log } from "../../../core/utils/decorators/logger";
import { Protected } from "../../decorators/protected";

@Controller("/authentication/app")
@Name("AuthenticationApp")
export class AuthenticationAppController {
	static log = getLogger.controller(AuthenticationAppController);
	private services: { authentication: AuthenticationService };

	constructor(authenticationService: AuthenticationService) {
		this.services = {
			authentication: authenticationService,
		};
	}

	@Post("/:app")
	@Returns(201, String)
	@Protected()
	@Log(AuthenticationAppController.log, [0])
	async createAppToken(@PathParams("app") app: string) {
		return this.services.authentication.createAppToken(app, true);
	}

	@Post("/:app/permanent")
	@Returns(201, String)
	@Protected()
	@Log(AuthenticationAppController.log, [0])
	async createPermanentAppToken(@PathParams("app") app: string, @Req() { auth }: Request) {
		AuthenticationAppController.log.warn(`${auth!.username} is creating a permanent token for the app ${app}`);
		return this.services.authentication.createAppToken(app, false);
	}

	@Delete("/:app")
	@Returns(204, String)
	@Protected()
	@Log(AuthenticationAppController.log, [0])
	async deleteAppToken(@PathParams("app") app: string, @Required(true) @BodyParams("token") token: string) {
		await this.services.authentication.deleteAppToken(app, token);
	}

	@Get("/:app")
	@(Returns(200, Array).Of(String))
	@Protected()
	@Log(AuthenticationAppController.log, [0, 1])
	async getTokens(@PathParams("app") app: string) {
		return this.services.authentication.getAppTokens(app);
	}

	@Get("/:app/valid")
	@Returns(200, Boolean)
	@Log(AuthenticationAppController.log, [0, 1])
	async validToken(@PathParams("app") app: string, @Required(true) @BodyParams("token") token: string) {
		return this.services.authentication.validateAppToken(app, token);
	}
}
