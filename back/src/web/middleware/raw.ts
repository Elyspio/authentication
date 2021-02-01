import * as  bodyParser from "body-parser";
import * as cookieParser from 'cookie-parser';
import * as cors from "cors";
import * as compress from "compression";
import * as methodOverride from "method-override";

export const middlewares: any[] = [];


middlewares.push(
    cors({
        origin: [
            "http://localhost:3000",
            "http://elyspio.fr",
        ],
        credentials: true,
        exposedHeaders: ["set-cookie"],
    }),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
        extended: true
    }),
)

