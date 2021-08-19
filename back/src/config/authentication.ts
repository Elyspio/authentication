import {Helper} from "../core/utils/helper";
import {env} from "process"
import isDev = Helper.isDev;

export const authorization_cookie_token = "authentication-token";
export const authorization_cookie_username = "authentication_login";
const token_timeout = env.TOKEN_EXPIRATION;
export const token_expiration = (token_timeout ? Number.parseInt(token_timeout) : 60) * 60 * 1000; // 60 mn
export const tokenDomains = isDev() ? ["http://127.0.0.1:3000", "http://127.0.0.1:3001"] : ["https://elyspio.fr"]
