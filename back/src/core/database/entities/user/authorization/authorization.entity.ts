import {Column} from "typeorm";
import {AuthenticationEntity} from "./authentication.entity";

export class AuthorizationEntity {
	@Column(() => AuthenticationEntity)
	authentication?: AuthenticationEntity
}
