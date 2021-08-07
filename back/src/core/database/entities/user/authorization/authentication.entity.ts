import {Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {AuthorizationEntity} from "./authorization.entity";
import {RolesEntity} from "./roles.entity";

@Entity("authentications")
export class AuthenticationEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => AuthorizationEntity, user => user.authentication)
	@JoinColumn({name: "authorization_id"})
	authorization: AuthorizationEntity


	@ManyToMany(() => RolesEntity,)
	@JoinTable({name: "authentications_roles"})
	roles: RolesEntity[]

}

