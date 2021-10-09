import { $log, BodyParams, Controller, Cookies, Delete, Get, Post, QueryParams, Req, Res, Use } from "@tsed/common";
import { AuthenticationService } from "../../../core/services/authentication/authentication.service";
import { Unauthorized } from "@tsed/exceptions";
import { authorization_cookie_token, authorization_cookie_username, token_expiration } from "../../../config/authentication";
import * as Express from "express";
import { Description, Required, Returns } from "@tsed/schema";
import { PostLoginInitRequest, PostLoginModel, PostLoginModelWithSalt, PostLoginRequest } from "./authentication.models";
import { RequireDevelopmentEnvironment, RequireLogin } from "../../middleware/util";
import { getLogger } from "../../../core/utils/logger";
import { Log } from "../../../core/utils/decorators/logger";

@Controller("/authentication")
export class Authentication {
	static log = getLogger.controller(Authentication);
	private services: { authentication: AuthenticationService };

	constructor(authenticationService: AuthenticationService) {
		this.services = {
			authentication: authenticationService,
		};
	}

	@Get("/logged")
	@Use(RequireDevelopmentEnvironment)
	@Log(Authentication.log)
	@Description("Return all logged users (Not available in production)")
	async get() {
		return { users: this.services.authentication.getLoggedUser() };
	}

	// region login

	@Post("/login/init")
	@Returns(200, PostLoginModelWithSalt)
	@Returns(Unauthorized.STATUS, Unauthorized)
	@Log(Authentication.log, false)
	@Description("Login first step: create a salt from user's name")
	async loginInit(@Req() { cookies }: Express.Request, @BodyParams(PostLoginInitRequest) { name }: PostLoginInitRequest) {
		$log.info("cookies", cookies);

		if (cookies[authorization_cookie_token]) {
			return { token: cookies[authorization_cookie_token], comment: "already logged in" };
		} else {
			const ret = new PostLoginModelWithSalt();
			ret.salt = await this.services.authentication.initLogin(name);
			return ret;
		}
	}

	@Post("/login")
	@Returns(200, PostLoginModel)
	@Returns(Unauthorized.STATUS, Unauthorized)
	@Log(Authentication.log, false)
	@Description("Login second step: check if the token provided match with the one computed by the server")
	async login(@Req() { cookies }: Express.Request, @Required() @BodyParams() { hash, name }: PostLoginRequest, @Res() res: Express.Response): Promise<PostLoginModel> {
		let token = cookies[authorization_cookie_token];

		if (token) {
			if (!this.services.authentication.validateToken(token)) {
				res.clearCookie(authorization_cookie_token);
				throw new Unauthorized("Invalid token");
			} else {
				return { token: token, comment: "Already logged in" };
			}
		} else {
			const { token, authorized } = await this.services.authentication.verifyLogin({ name: name, hash: hash });

			if (authorized && token) {
				this.setCookies(res, name, token);
				return { token };
			} else {
				throw new Unauthorized("Username or Password do not match");
			}
		}
	}

	@Delete("/login")
	@Returns(204)
	@Use(RequireLogin)
	@Log(Authentication.log)
	async logout(@Cookies(authorization_cookie_username, String) username: string, @Res() res: Express.Response) {
		await this.services.authentication.logout(username);
		res.clearCookie(authorization_cookie_username);
		res.clearCookie(authorization_cookie_token);
	}

	// endregion login

	@Get("/valid")
	@Returns(200, Boolean)
	@Log(Authentication.log, [0])
	async validToken(@Required() @QueryParams("token") token: string, @Req() { cookies, headers }: Express.Request, @Res() res: Express.Response) {
		const cookieAuth = cookies[authorization_cookie_token];
		const headerToken = headers[authorization_cookie_token];

		$log.info("validToken", { cookie: cookieAuth, header: headerToken, token });

		token = token ?? cookieAuth;
		token = token ?? (headerToken as string);

		const valid = token !== undefined && this.services.authentication.validateToken(token);
		if (valid) {
			const { username } = this.services.authentication.getUserFromToken(token);
			this.setCookies(res, username, token);
		}

		return valid;
	}

	private setCookies(res: Express.Response, username: string, token: string) {
		res.cookie(authorization_cookie_username, username, { maxAge: token_expiration, httpOnly: true, secure: true });
		res.cookie(authorization_cookie_token, token, { maxAge: token_expiration, httpOnly: true, secure: true });
	}
}
