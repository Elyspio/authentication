import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { token_expiration } from "../../../../config/authentication";

@Entity("user.connection")
export class UserConnectionEntity {
	@ObjectIdColumn()
	id!: ObjectID;

	@Column()
	username!: string;

	@Column()
	token!: string;

	@Column()
	salt!: string;

	@Column()
	created!: Date;

	@Column()
	expire!: Date;

	@Column({ default: false })
	invalidated!: boolean;

	/***
	 * Create a connection entity with default params
	 * @param username
	 * @param token
	 * @param salt
	 */
	constructor(username: string, token: string, salt: string) {
		this.username = username;
		this.token = token;
		this.salt = salt;
		this.created = new Date();
		this.expire = new Date(Date.now() + token_expiration);
		this.invalidated = false;
	}
}
