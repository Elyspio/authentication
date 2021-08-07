import {Controller, Cookies, Get, PathParams, Use} from "@tsed/common";
import {Description, Enum, Required, Returns} from "@tsed/schema";
import {Forbidden, Unauthorized} from "@tsed/exceptions";
import {CredentialsModel, UserSettingsModel} from "./users.model";
import {authorization_cookie_token, authorization_cookie_username} from "../../../config/authentication";
import {RequireLogin} from "../../middleware/util";
import {UserService} from "../../../core/services/user/user.service";

@Controller("/users")
export class Users {
	private services: { user: UserService };

	constructor(userService: UserService) {
		this.services = {
			user: userService
		}
	}


	@Get("/:username/credentials")
	@Returns(200, CredentialsModel)
	@Returns(Unauthorized.STATUS, Unauthorized)
	@Use(RequireLogin)
	async getUserCredentials(@Required @PathParams("username") username: string) {
		return this.services.user.getAccountData(username);
	}


	@Get("/:username/settings")
	@Returns(200, UserSettingsModel)
	@Returns(Unauthorized.STATUS, Unauthorized)
	@Use(RequireLogin)
	async getUserSettings(@Required @PathParams("username") username: string) {
		return this.services.user.getAccountSettings(username);
	}


	@Get("/:kind")
	@Returns(200, String)
	@Returns(Forbidden.STATUS, Forbidden)
	@Description("Return username")
	async getCookieInfo(
		@Cookies(authorization_cookie_username) username: string,
		@Required @Cookies(authorization_cookie_token) token: string,
		@Required @Enum("username", "token") @PathParams("kind") kind: "username" | "token"
	) {

		if (!token && !username) throw new Forbidden("Not logged")

		if (kind === "username") return username
		if (kind === "token") return token
	}


}
