import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {AuthenticationEntity} from "./authentication.entity";


export enum Roles {
	User = "User",
	Admin = "Admin"
}


@Entity("roles")
export class RolesEntity {
	@PrimaryGeneratedColumn({type: "smallint"})
	id: number;

	@Column({type: "enum", enum: Roles, default: Roles.User, nullable: false})
	value: Roles

	@ManyToMany(() => AuthenticationEntity)
	authentications: AuthenticationEntity[]

}

