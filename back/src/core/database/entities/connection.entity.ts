import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity("connections")
export class ConnectionEntity {

	@PrimaryColumn()
	username: string;

	@Column()
	token: string;

	@Column()
	salt: string;

	@Column()
	created: Date;

	@Column()
	expire: Date;

	@Column({default: false})
	invalidated: boolean

}
