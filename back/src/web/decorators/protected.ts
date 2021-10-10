import { In, JsonParameterTypes, Returns } from "@tsed/schema";
import { UseAuth } from "@tsed/common";
import { useDecorators } from "@tsed/core";
import { Forbidden, Unauthorized } from "@tsed/exceptions";
import { authorization_cookie_token } from "../../config/authentication";
import { RequireLogin } from "../middleware/authentication";
import { Roles } from "../../core/database/entities/user/authorization/authentication.entity";
import { Helper } from "../../core/utils/helper";
import isDev = Helper.isDev;

export type ProtectedOptions = {
	roles: Roles[];
	required: "all" | "any";
};

export function Protected(options: ProtectedOptions = { roles: [Roles.User], required: "any" }): Function {
	return useDecorators(
		UseAuth(RequireLogin, options),
		In(JsonParameterTypes.HEADER).Name(authorization_cookie_token).Type(String).Required(false).Description("Authorization in header"),
		In(JsonParameterTypes.COOKIES).Name(authorization_cookie_token).Type(String).Required(false).Description("Authorization in cookie"),
		Returns(Unauthorized.STATUS, isDev() ? Unauthorized : String).Description("You are not logged"),
		Returns(Forbidden.STATUS, isDev() ? Forbidden : String).Description("You are missing a required role")
	);
}
