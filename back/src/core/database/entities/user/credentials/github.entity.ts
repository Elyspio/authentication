import {Column} from "typeorm";

export class GithubEntity {
	@Column()
	token: string;

	@Column()
	user: string;
}
