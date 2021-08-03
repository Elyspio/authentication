import {Helper} from "../core/utils/helper";
import isDev = Helper.isDev;

export const authorization_cookie_token = "authentication_token";
export const authorization_cookie_username = "authentication_login";
export const token_expiration = 60 * 15 * 1000; // 15 mn
export const tokenDomains = isDev() ? ["http://127.0.0.1:3000", "http://127.0.0.1:3001"] : ["https://elyspio.fr"]
