import { BodyParams, Controller, Get, PathParams, Post, Req } from "@tsed/common";
import { Description, Enum, Name, Required, Returns } from "@tsed/schema";
import { AddUserModel } from "./users.model";
import { UserService } from "../../../core/services/user/user.service";
import { Protected } from "../../decorators/protected";
import { Request } from "express";

@Controller("/users")
@Name("Users")
export class Users {
	private services: { user: UserService };

	constructor(userService: UserService) {
		this.services = {
			user: userService,
		};
	}

	@Get("/exist")
	@(Returns(200, Boolean).ContentType("text/plain").Description("If at least one user existe"))
	async checkIfUsersExist() {
		return await this.services.user.checkIfUsersExist();
	}

	@Get("/:kind")
	@(Returns(200, String).ContentType("text/plain").Description("Username or token of logged user"))
	@Description("Return username or token of logged user")
	@Protected()
	async getUserInfo(@Required() @Enum("username", "token") @PathParams("kind") kind: "username" | "token", @Req() { auth }: Request) {
		return auth![kind];
	}

	@Post("/")
	@(Returns(201, String).Description("User's username"))
	@Description("Create an user")
	async addUser(@Required() @BodyParams() { username, hash }: AddUserModel) {
		await this.services.user.createUser(username, hash);
		return username;
	}
}