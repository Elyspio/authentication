import { Context, Middleware, QueryParams, Req } from "@tsed/common";
import { Forbidden, Unauthorized } from "@tsed/exceptions";
import { Request } from "express";
import { authorization_cookie_token } from "../../config/authentication";
import { getLogger } from "../../core/utils/logger";
import { AuthenticationService } from "../../core/services/authentication/authentication.service";
import { MiddlewareMethods } from "@tsed/platform-middlewares/lib/domain/MiddlewareMethods";
import { UserService } from "../../core/services/user/user.service";
import { Helper } from "../../core/utils/helper";
import { AuthorizationEntity } from "../../core/database/entities/user/authorization/authorization.entity";
import { ProtectedOptions } from "../decorators/protected";
import { Roles } from "../../core/database/entities/user/authorization/authentication.entity";

@Middleware()
export class RequireLogin implements MiddlewareMethods {
	private static log = getLogger.middleware(RequireLogin);
	private services: { user: UserService; authentication: AuthenticationService };

	constructor(authentication: AuthenticationService, user: UserService) {
		this.services = {
			authentication,
			user,
		};
	}

	public async use(@Req() req: Request, @Context() ctx: Context, @QueryParams("token") token?: string) {
		const exception = new Unauthorized("You must be logged to access to this resource see https://elyspio.fr/authentication/");

		const options: ProtectedOptions = ctx.endpoint.get(RequireLogin) || {};

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

			if (this.services.authentication.validateToken(token)) {
				const userFromToken = this.services.authentication.getUserFromToken(token);

				const userAuthorization = await this.services.user.getUserAuthorisatons(userFromToken.username);
				if (options.roles) {
					if (options.required === "all") {
						if (!options.roles.every((role) => userAuthorization.authentication?.roles.includes(Helper.getEnumValue(Roles, role)))) {
							throw new Forbidden(`You must have the following roles ${options.roles.join(" ")} to access to this resource see https://elyspio.fr/authentication/`);
						}
					} else if (options.required === "any") {
						if (!options.roles.some((role) => userAuthorization.authentication?.roles.includes(Helper.getEnumValue(Roles, role)))) {
							throw new Forbidden(
								`You must have the one of these roles ${options.roles.join(" ")} to access to this resource see https://elyspio.fr/authentication/`
							);
						}
					} else throw new Error("Not supported operation RequireLogin.roles");
				}

				req.auth = {
					username: userFromToken.username,
					token: userFromToken.token!,
					authorization: userAuthorization ?? { authentication: { roles: [Roles.User] } },
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
				authorization: AuthorizationEntity;
			};
		}
	}
}
