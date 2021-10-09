import { Column } from "typeorm";
import { RolesEntity } from "./roles.entity";

export class AuthenticationEntity {
	@Column({ array: true })
	roles!: RolesEntity[];
}
