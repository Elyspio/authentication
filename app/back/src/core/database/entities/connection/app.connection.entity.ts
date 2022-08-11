import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { token_expiration } from "../../../../config/authentication";

@Entity("app.connection")
export class AppConnectionEntity {
	@ObjectIdColumn()
	id!: ObjectID;

	@Column()
	token!: string;

	@Column()
	created!: Date;

	@Column()
	expire!: Date;

	@Column()
	app!: string;

	@Column({ default: false })
	invalidated!: boolean;

	/***
	 * Create a connection entity with default params
	 * @param app
	 * @param token
	 * @param expire if the token will expire after time has passed (if false, it will expire in 100 years)
	 */
	constructor(app: string, token: string, expire: boolean) {
		this.app = app;
		this.token = token;
		this.created = new Date();
		this.expire = new Date(Date.now() + (expire ? token_expiration : 3600 * 24 * 365 * 100 * 1000));
		this.invalidated = false;
	}
}
