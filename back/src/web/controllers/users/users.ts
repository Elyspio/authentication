import {Controller, Get, PathParams} from "@tsed/common";
import {Core} from "../../../core/services/authentication/authentication";
import {Returns} from "@tsed/schema";
import {KeysModel} from "./models";

@Controller("/users")
export class Users {

	@Get("/:username/keys")
	@Returns(200, KeysModel)
	async getUserKeys(@PathParams("username") username: string) {
		return await Core.Account.getAccountData(username);
	}

}
