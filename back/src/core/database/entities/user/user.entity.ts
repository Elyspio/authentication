import { Column, Entity, ObjectID, ObjectIdColumn, Unique } from "typeorm";
import { CredentialsEntity } from "./credentials/credentials.entity";
import { SettingsEntity } from "./settings.entity";
import { AuthorizationEntity } from "./authorization/authorization.entity";

@Entity("users")
@Unique(["username"])
export class UserEntity {
	@ObjectIdColumn()
	id!: ObjectID;

	@Column()
	username!: string;

	@Column()
	hash!: string;

	@Column(() => CredentialsEntity)
	credentials!: CredentialsEntity;

	@Column(() => SettingsEntity)
	settings!: SettingsEntity;

	@Column(() => AuthorizationEntity)
	authorization!: AuthorizationEntity;
}
