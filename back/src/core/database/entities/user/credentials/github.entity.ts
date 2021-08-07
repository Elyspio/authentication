import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {CredentialsEntity} from "./credentials.entity";

@Entity("github")
export class GithubEntity {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	token: string;

	@Column()
	user: string;

	@OneToOne(() => CredentialsEntity, cred => cred.github,)
	@JoinColumn({name: "credentials_id"})
	credentialsEntity: CredentialsEntity


}
