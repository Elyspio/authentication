import { Column } from "typeorm";

export enum Roles {
	User = "User",
	Admin = "Admin",
}

export class AuthenticationEntity {
	@Column({ type: "enum", enum: Roles, default: Roles.User, array: true })
	roles!: Roles[];
}
