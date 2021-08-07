import {IMiddleware, Middleware, QueryParams, Req} from "@tsed/common";
import {NotFound, Unauthorized} from "@tsed/exceptions";
import {Helper} from "../../core/utils/helper";
import {getLogger} from "../../core/utils/logger";
import {Request} from "express"
import {authorization_cookie_token} from "../../config/authentication";
import {AuthenticationService} from "../../core/services/authentication/authentication.service";
import isDev = Helper.isDev;

@Middleware()
export class RequireDevelopmentEnvironment implements IMiddleware {
	public use() {
		if (!isDev()) {
			throw new NotFound("This resource is not accessible in production");
		}
	}
}

@Middleware()
export class RequireLogin implements IMiddleware {

	private static log = getLogger.middleware(RequireLogin)
	private services: { authentication: AuthenticationService };


	constructor(authenticationService: AuthenticationService) {
		this.services = {
			authentication: authenticationService
		}
	}


	public async use(@Req() {headers, cookies}: Request, @QueryParams("token") token: string) {

		RequireLogin.log.info("New request checking IGNORE_AUTH value", process.env.IGNORE_AUTH)

		if (!process.env.IGNORE_AUTH) {
			try {

				const cookieAuth = cookies[authorization_cookie_token]
				const headerToken = headers[authorization_cookie_token];

				RequireLogin.log.info("RequireLogin", {cookies: cookies.authorization_cookie_token, token, header: headerToken})

				token = token ?? cookieAuth;
				token = token ?? headerToken as string

				if (this.services.authentication.validateToken(token)) {
					return true
				} else throw ""
			} catch (e) {
				throw new Unauthorized("You must be logged to access to this resource see https://elyspio.fr/authentication");
			}
		}
	}
}
