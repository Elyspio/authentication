import { BodyParams, Controller, Get, Patch, PathParams } from "@tsed/common";
import { Name, Required, Returns } from "@tsed/schema";
import { CredentialsModel } from "./users.model";
import { UserService } from "../../../core/services/user/user.service";
import { Protected } from "../../decorators/protected";

@Controller("/users/:username/credentials")
@Name("Users.Credentials")
export class CredentialsUsersController {
	private services: { user: UserService };

	constructor(userService: UserService) {
		this.services = {
			user: userService,
		};
	}

	@Get("/")
	@Returns(200, CredentialsModel)
	@Protected()
	async get(@Required() @PathParams("username") username: string) {
		return this.services.user.getUserCredentials(username);
	}

	@Patch("/")
	@Returns(204)
	@Protected()
	async set(@Required() @PathParams("username") username: string, @Required(true) @BodyParams() credential: CredentialsModel) {
		await this.services.user.setUserCredentials(username, credential);
	}
}
