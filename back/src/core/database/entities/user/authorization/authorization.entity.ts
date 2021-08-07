import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../user.entity";
import {AuthenticationEntity} from "./authentication.entity";

@Entity("authorizations")
export class AuthorizationEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => AuthenticationEntity, authentification => authentification.authorization)
	authentication: AuthenticationEntity

	@OneToOne(() => UserEntity, user => user.authorization)
	@JoinColumn({name: "username"})
	user: UserEntity

}
