import {Column} from "typeorm";

export class GithubEntity {
	@Column({nullable: false})
	token!: string;

	@Column({nullable: false})
	user!: string;
}
