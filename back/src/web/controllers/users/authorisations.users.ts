import { BodyParams, Controller, Get, Patch, PathParams } from "@tsed/common";
import { Name, Required, Returns } from "@tsed/schema";
import { AuthorizationModel } from "./users.model";
import { UserService } from "../../../core/services/user/user.service";
import { Protected } from "../../decorators/protected";
import { Roles } from "../../../core/database/entities/user/authorization/authentication.entity";

@Controller("/users/:username/authorisations")
@Name("Users.Authorisations")
export class AuthorisationsUsersController {
	private services: { user: UserService };

	constructor(userService: UserService) {
		this.services = {
			user: userService,
		};
	}

	@Get("/")
	@Returns(200, AuthorizationModel)
	@Protected()
	async get(@Required() @PathParams("username") username: string) {
		return this.services.user.getUserAuthorisatons(username);
	}

	@Patch("/")
	@Returns(204)
	@Protected({ roles: [Roles.Admin], required: "all" })
	async set(@Required() @PathParams("username") username: string, @Required(true) @BodyParams() authorization: AuthorizationModel) {
		await this.services.user.setUserAuthorisation(username, authorization);
	}
}
