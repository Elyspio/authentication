import { BodyParams, Controller, Get, Patch, PathParams, QueryParams } from "@tsed/common";
import { Enum, Name, Required, Returns } from "@tsed/schema";
import { FrontThemeReturnModel, FrontThemes, SetUserSettingsModel, UserSettingsModel } from "./users.model";
import { UserService } from "../../../core/services/user/user.service";
import { Protected } from "../../decorators/protected";
import { Helper } from "../../../core/utils/helper";

@Controller("/users/:username/settings")
@Name("SettingsUsers")
export class SettingsUsersController {
	private services: { user: UserService };

	constructor(userService: UserService) {
		this.services = {
			user: userService,
		};
	}

	@Patch("/")
	@Returns(201)
	@Protected()
	async set(@Required() @PathParams("username") username: string, @Required() @BodyParams() settings: SetUserSettingsModel) {
		await this.services.user.setAccountSettings(username, settings);
	}

	@Get("/")
	@Returns(200, UserSettingsModel)
	@Protected()
	async get(@Required() @PathParams("username") username: string) {
		return this.services.user.getAccountSettings(username);
	}

	@Get("/theme")
	@Returns(200, FrontThemeReturnModel)
	@Protected()
	async getTheme(
		@Required() @PathParams("username") username: string,
		@Required() @Enum(...Helper.getEnumValues(FrontThemes)) @QueryParams("windows_theme") windowsTheme: FrontThemes
	) {
		const theme = await this.services.user.getUserTheme(username, windowsTheme);
		return {
			theme,
		};
	}
}
