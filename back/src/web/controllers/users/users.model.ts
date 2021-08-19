import {Enum, Property, Required} from "@tsed/schema";
import {Credentials, Docker, Github, UserSettings} from "../../../core/services/authentication/authentication.types";
import {Helper} from "../../../core/utils/helper";

export class DockerModel implements Docker {
	@Property()
	@Required()
	password: string;

	@Property()
	@Required()
	username: string;

}

export class GithubModel implements Github {
	@Property()
	@Required()
	token: string;

	@Property()
	@Required()
	user: string;

}

export class CredentialsModel implements Credentials {
	@Property(DockerModel)
	docker: DockerModel;

	@Property(GithubModel)
	github: GithubModel;

}

export class UserSettingsModel implements UserSettings {
	@Enum("dark", "light", "system")
	@Property()
	@Required()
	theme: UserSettings["theme"]
}


export class SetUserSettingsModel implements UserSettings {
	@Enum("dark", "light", "system")
	@Property()
	theme: UserSettings["theme"]
}

export enum FrontThemes {
	dark = "dark",
	light = "light"
}


export class FrontThemeReturnModel {
	@Required()
	@Property()
	@Enum(...Helper.getEnumValues(FrontThemes))
	theme: FrontThemes
}

