import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {DockerEntity} from "./docker.entity";
import {GithubEntity} from "./github.entity";
import {UserEntity} from "../user.entity";

@Entity("credentials")
@Unique(["user"])
export class CredentialsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => GithubEntity, github => github.credentialsEntity)
	github: GithubEntity;

	@OneToOne(() => DockerEntity, docker => docker.credentialsEntity)
	docker: DockerEntity;

	@OneToOne(() => UserEntity, user => user.credentials,)
	@JoinColumn({name: "username"})
	user: UserEntity
}
