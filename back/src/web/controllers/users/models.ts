import {Property, Required} from "@tsed/schema";
import {Docker, Github, Keys} from "../../../core/services/authentication/types";

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

export class KeysModel implements Keys {
	@Property(DockerModel)
	docker: DockerModel;

	@Property(GithubModel)
	github: GithubModel;

}
