import {Column, Entity, ObjectID, ObjectIdColumn} from "typeorm";

@Entity("connections")
export class ConnectionEntity {

	@ObjectIdColumn()
	id: ObjectID

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
