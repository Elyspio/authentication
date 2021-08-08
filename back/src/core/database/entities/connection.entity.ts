import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("connections")
export class ConnectionEntity {

	@PrimaryGeneratedColumn()
	id: number

	@Column()
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
