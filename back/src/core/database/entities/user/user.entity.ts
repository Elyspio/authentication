import {Column, Entity, OneToOne, PrimaryColumn} from "typeorm";
import {CredentialsEntity} from "./credentials/credentials.entity";
import {SettingsEntity} from "./settings.entity";
import {AuthorizationEntity} from "./authorization/authorization.entity";

@Entity("users")
export class UserEntity {
	@PrimaryColumn()
	username: string

	@Column()
	hash: string;

	@OneToOne(() => CredentialsEntity, credentials => credentials.user)
	credentials: CredentialsEntity;

	@OneToOne(() => SettingsEntity, setting => setting.user)
	settings: SettingsEntity;

	@OneToOne(() => SettingsEntity, setting => setting.id)
	authorization: AuthorizationEntity;
}
