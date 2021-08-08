import {BodyParams, Controller, Cookies, Get, Patch, PathParams, Use} from "@tsed/common";
import {Description, Enum, Required, Returns, string} from "@tsed/schema";
import {Forbidden, Unauthorized} from "@tsed/exceptions";
import {CredentialsModel, SetUserSettingsModel, UserSettingsModel} from "./users.model";
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
		return this.services.user.getUserCredentials(username);
	}


	@Patch("/:username/settings")
	@Returns(201)
	@Returns(Unauthorized.STATUS, Unauthorized)
	@Use(RequireLogin)
	async setUserSettings(
		@Required @PathParams("username") username: string,
		@Required @BodyParams() settings: SetUserSettingsModel
	) {
		await this.services.user.setAccountSettings(username, settings);
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
