import {Column} from "typeorm";
import {DockerEntity} from "./docker.entity";
import {GithubEntity} from "./github.entity";

export class CredentialsEntity {

	@Column(() => GithubEntity)
	github: GithubEntity;

	@Column(() => DockerEntity)
	docker: DockerEntity;
}
