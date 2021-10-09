import { IMiddleware, Middleware, QueryParams, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Request } from "express";
import { authorization_cookie_token } from "../../config/authentication";
import { getLogger } from "../../core/utils/logger";
import { Inject } from "@tsed/di";
import { AuthenticationService } from "../../core/services/authentication/authentication.service";

@Middleware()
export class RequireLogin implements IMiddleware {
	private static log = getLogger.middleware(RequireLogin);
	@Inject()
	private authenticationService!: AuthenticationService;

	public async use(@Req() req: Request, @QueryParams("token") token?: string) {
		const exception = new Unauthorized("You must be logged to access to this resource see https://elyspio.fr/authentication/");

		// Sanitize token param
		if (token === "") token = undefined;

		try {
			const cookieAuth = req.cookies[authorization_cookie_token];
			const headerToken = req.headers[authorization_cookie_token];

			RequireLogin.log.info("RequireLogin", {
				cookieAuth,
				headerToken,
				uriToken: token,
			});

			token = token ?? cookieAuth;
			token = token ?? (headerToken as string);

			if (this.authenticationService.validateToken(token)) {
				const userFromToken = this.authenticationService.getUserFromToken(token);
				req.auth = {
					username: userFromToken.username,
					token: userFromToken.token!,
				};
			} else throw exception;
		} catch (e) {
			throw exception;
		}
	}
}

declare global {
	namespace Express {
		interface Request {
			auth?: {
				username: string;
				token: string;
			};
		}
	}
}
