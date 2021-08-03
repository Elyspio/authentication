import {$log, BodyParams, Controller, Delete, Get, Post, Req, Res, Use} from "@tsed/common";
import {Core} from "../../../core/services/authentication/authentication";
import {Unauthorized,} from "@tsed/exceptions"
import {authorization_cookie_token, authorization_cookie_username, token_expiration} from '../../../config/authentication';
import * as Express from "express";
import {Required, Returns} from "@tsed/schema";
import {PostLoginInitRequest, PostLoginModel, PostLoginModelWithSalt, PostLoginRequest} from "./authentication.models";
import {RequireDevelopmentEnvironment} from "../../middleware/util";


@Controller("/authentication")
export class Authentication {

	@Get("/everything")
	@Use(RequireDevelopmentEnvironment)
	async get() {
		return {users: Core.Account.users}
	}

	// region login

	@Post("/login")
	@Returns(200, PostLoginModel)
	@Returns(Unauthorized.STATUS, Unauthorized)
	async login(
		@Req() {cookies}: Express.Request,
		@Required() @BodyParams() {hash, name}: PostLoginRequest,
		@Res() res: Express.Response
	): Promise<PostLoginModel> {

		let token = cookies[authorization_cookie_token];

		if (token) {
			if (!Core.Account.Token.validate(token)) {
				res.clearCookie(authorization_cookie_token)
				throw new Unauthorized("Invalid token")
			} else {
				return {token: token, comment: "Already logged in"};
			}

		} else {
			const {token, authorized} = await Core.Account.verify({name: name, hash: hash})

			if (authorized && token) {
				res.cookie(authorization_cookie_username, name, {maxAge: token_expiration, httpOnly: true, secure: true})
				res.cookie(authorization_cookie_token, token, {maxAge: token_expiration, httpOnly: true, secure: true})
				res.json({token})
			} else {
				throw new Unauthorized("Username or Password do not match")
			}
		}

	}

	@Post("/login/init")
	@Returns(200, PostLoginModelWithSalt)
	@Returns(Unauthorized.STATUS, Unauthorized)
	async loginInit(@Req() {cookies}: Express.Request, @BodyParams(PostLoginInitRequest) {name}: PostLoginInitRequest) {

		$log.info("cookies", cookies);

		if (cookies[authorization_cookie_token]) {

			return {token: cookies[authorization_cookie_token], comment: "already logged in"};
		} else {
			const ret = new PostLoginModelWithSalt();
			ret.salt = await Core.Account.init(name)
			return ret
		}
	}


	// endregion login

	@Get("/valid")
	@Returns(200, Boolean)
	async validToken(@BodyParams("token") token: string, @Req() {cookies, headers}: Express.Request) {

		const cookieAuth = cookies[authorization_cookie_token]
		const headerToken = headers[authorization_cookie_token];

		$log.info("validToken", {cookie: cookieAuth, header: headerToken, token})

		token = token ?? cookieAuth;
		token = token ?? headerToken as string

		return token !== undefined && Core.Account.Token.validate(token)
	}

	@Delete("/valid")
	@Returns(204)
	async deleteToken(@BodyParams("user") user: string) {
		await Core.Account.Token.del(user);
	}

}
