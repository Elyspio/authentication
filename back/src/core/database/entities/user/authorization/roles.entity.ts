import {Column} from "typeorm";


export enum Roles {
	User = "User",
	Admin = "Admin"
}


export class RolesEntity {
	@Column({type: "enum", enum: Roles, default: Roles.User, nullable: false})
	value: Roles


	constructor(value: Roles) {
		this.value = value;
	}
}

