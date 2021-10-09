import { Column } from "typeorm";

export class DockerEntity {
	@Column({ nullable: false })
	username!: string;

	@Column({ nullable: false })
	password!: string;
}
