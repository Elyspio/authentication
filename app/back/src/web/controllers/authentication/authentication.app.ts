import { Controller, Delete, Get, PathParams, Post, QueryParams, Req } from "@tsed/common";
import { AuthenticationService } from "../../../core/services/authentication/authentication.service";
import { Request } from "express";
import { Enum, Name, Required, Returns } from "@tsed/schema";
import { getLogger } from "../../../core/utils/logger";
import { Log } from "../../../core/utils/decorators/logger";
import { Protected } from "../../decorators/protected";
import { App } from "./authentication.models";

@Controller("/authentication/apps")
@Name("AuthenticationApp")
export class AuthenticationAppController {
	static log = getLogger.controller(AuthenticationAppController);
	private services: { authentication: AuthenticationService };

	constructor(authenticationService: AuthenticationService) {
		this.services = {
			authentication: authenticationService,
		};
	}

	@Post("/:app/permanent")
	@(Returns(201, String).ContentType("text/plain"))
	@Protected()
	@Log(AuthenticationAppController.log, [0])
	async createPermanentAppToken(@Enum(App) @PathParams("app") app: App, @Req() { auth }: Request) {
		AuthenticationAppController.log.warn(`${auth!.username} is creating a permanent token for the app ${app}`);
		return this.services.authentication.createAppToken(app, false);
	}

	@Get("/:app")
	@(Returns(200, Array).Of(String))
	@Protected()
	@Log(AuthenticationAppController.log, [0, 1])
	async getTokens(@Enum(App) @PathParams("app") app: App) {
		return this.services.authentication.getAppTokens(app);
	}

	@Delete("/:app/:token")
	@Returns(204)
	@Protected()
	@Log(AuthenticationAppController.log, [0, 1])
	async deleteTokens(@Enum(App) @PathParams("app") app: App, @PathParams("token") token: string) {
		await this.services.authentication.deleteAppToken(app, token);
	}


	@Get("/:app/valid")
	@(Returns(200, Boolean).ContentType("text/plain"))
	@Log(AuthenticationAppController.log, [0, 1])
	async validToken(@Enum(App) @PathParams("app") app: App, @Required(true) @QueryParams("token") token: string) {
		return this.services.authentication.validateAppToken(app, token);
	}
}
