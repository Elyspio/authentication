import {Property} from "@tsed/schema";

export class PostLoginModel {
    @Property()
    token: string

    @Property()
    comment?: string
}

export class PostLoginRequest {
    @Property()
    hash: string

    @Property()
    name?: string
}

export class PostLoginInitRequest {
    @Property()
    hash: string

    @Property()
    name?: string
}

export class PostLoginModelWithSalt {
    @Property()
    salt: string
}
