import {Controller, Get, PathParams, Req, Use} from "@tsed/common";
import {Core} from "../../../core/services/authentication/authentication";
import {Description, Enum, Returns} from "@tsed/schema";
import {Forbidden, Unauthorized} from "@tsed/exceptions";
import {CredentialsModel, UserSettingsModel} from "./users.model";
import * as Express from "express";
import {authorization_cookie_token, authorization_cookie_username} from "../../../config/authentication";
import {RequireLogin} from "../../middleware/util";

@Controller("/users")
export class Users {

	@Get("/:username/keys")
	@Returns(200, CredentialsModel)
	@Returns(Unauthorized.STATUS, Unauthorized)
	@Use(RequireLogin)
	async getUserKeys(@PathParams("username") username: string) {
		return await Core.Account.getAccountData(username);
	}


	@Get("/:username/settings")
	@Returns(200, UserSettingsModel)
	@Returns(Unauthorized.STATUS, Unauthorized)
	@Use(RequireLogin)
	async getUserSettings(@PathParams("username") username: string) {
		return await Core.Account.getAccountSettings(username);
	}


	@Get("/:kind")
	@Returns(200, String)
	@Returns(Forbidden.STATUS, Forbidden)
	@Description("Return username")
	async getCookieInfo(
		@Req() {cookies}: Express.Request,
		@Enum("username", "token") @PathParams("kind") kind: "username" | "token"
	) {
		const username = cookies[authorization_cookie_username];
		const token = cookies[authorization_cookie_token];

		if(!token && !username) throw new Forbidden("Not logged")

		if (kind === "username") return username
		if (kind === "token") return token
	}


}
