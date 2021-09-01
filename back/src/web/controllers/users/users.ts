import {BodyParams, Controller, Get, Patch, PathParams, Post, QueryParams, Req} from "@tsed/common";
import {Description, Enum, Required, Returns} from "@tsed/schema";
import {AddUserModel, CredentialsModel, FrontThemeReturnModel, FrontThemes, SetUserSettingsModel, UserSettingsModel,} from "./users.model";
import {UserService} from "../../../core/services/user/user.service";
import {Helper} from "../../../core/utils/helper";
import {Protected} from "../../decorators/protected";
import {Request} from "express";

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
	@Protected()
	async getUserCredentials(@Required @PathParams("username") username: string) {
		return this.services.user.getUserCredentials(username);
	}


	@Patch("/:username/settings")
	@Returns(201)
	@Protected()
	async setUserSettings(
		@Required @PathParams("username") username: string,
		@Required @BodyParams() settings: SetUserSettingsModel
	) {
		await this.services.user.setAccountSettings(username, settings);
	}


	@Get("/:username/settings")
	@Returns(200, UserSettingsModel)
	@Protected()
	async getUserSettings(@Required @PathParams("username") username: string) {
		return this.services.user.getAccountSettings(username);
	}

	@Get("/:username/settings/theme")
	@Returns(200, FrontThemeReturnModel)
	@Protected()
	async getUserTheme(
		@Required() @PathParams("username") username: string,
		@Required() @Enum(...Helper.getEnumValues(FrontThemes)) @QueryParams("windows_theme") windowsTheme: FrontThemes
	) {
		const theme = await this.services.user.getUserTheme(username, windowsTheme);
		return {
			theme
		}
	}


	@Get("/:kind")
	@Returns(200, String).Description("Username or token of logged user")
	@Description("Return username or token of logged user")
	@Protected()
	async getUserInfo(
		@Required @Enum("username", "token") @PathParams("kind") kind: "username" | "token",
		@Req() {auth}: Request
	) {
		return auth![kind];
	}


	@Post("/")
	@Returns(201, String).Description("User's username")
	@Description("Create an user")
	async addUser(
		@Required @BodyParams() {username, hash}: AddUserModel
	) {
		await this.services.user.createUser(username, hash);
		return username;
	}

}
