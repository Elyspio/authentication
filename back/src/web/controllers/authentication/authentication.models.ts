import {Property, Required} from "@tsed/schema";

export class PostLoginModel {
	@Property()
	@Required()
	token: string

	@Property()
	comment?: string
}

export class PostLoginRequest {
	@Property()
	@Required()
	hash: string

	@Property()
	@Required()
	name: string
}

export class PostLoginInitRequest {
	@Property()
	hash?: string

	@Property()
	@Required()
	name: string
}

export class PostLoginModelWithSalt {
	@Property()
	@Required()
	salt: string
}

