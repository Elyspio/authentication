import * as  bodyParser from "body-parser";
import * as cookieParser from 'cookie-parser';
import * as cors from "cors";
import * as compress from "compression";
import * as methodOverride from "method-override";
import {Helper} from "../../core/utils/helper";
import {authorization_cookie_token} from "../../config/authentication";
import isDev = Helper.isDev;

export const middlewares: any[] = [];


if (isDev()) {
	middlewares.push(cors({
		origin: [
			"http://127.0.0.1:3000",
			"http://127.0.0.1:3001",
			"http://localhost:3000",
			"http://localhost:3001",
		],
		credentials: true,
		allowedHeaders: [authorization_cookie_token],
		exposedHeaders: ["set-cookie", authorization_cookie_token],
	}))
} else {
	middlewares.push(cors({
		origin: [
			"https://elyspio.fr",
		],
		credentials: true,
		exposedHeaders: ["set-cookie"],
	}),)
}

middlewares.push(
	cookieParser(),
	compress({}),
	methodOverride(),
	bodyParser.json(),
	bodyParser.urlencoded({
		extended: true
	}),
)

