import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {CredentialsEntity} from "./credentials.entity";

@Entity("docker")
export class DockerEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({nullable: false})
	username: string;

	@Column({nullable: false})
	password: string;

	@OneToOne(() => CredentialsEntity, cred => cred.docker,)
	@JoinColumn({name: "credentials_id", referencedColumnName: "id"})
	credentialsEntity: CredentialsEntity

}
