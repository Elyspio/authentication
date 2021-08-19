import {In, JsonParameterTypes, Returns} from "@tsed/schema";
import {UseAuth} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {Forbidden} from "@tsed/exceptions/lib/clientErrors"
import {authorization_cookie_token} from "../../config/authentication";
import {RequireLogin} from "../middleware/authentication";


export function Protected(): Function {
	return useDecorators(
		UseAuth(RequireLogin),
		In(JsonParameterTypes.HEADER).Name(authorization_cookie_token).Type(String).Required(false).Description("Authorization in header"),
		In(JsonParameterTypes.COOKIES).Name(authorization_cookie_token).Type(String).Required(false).Description("Authorization in cookie"),
		Returns(403, Forbidden).Description("You are not logged")
	);
}
