import * as  bodyParser from "body-parser";
import * as cookieParser from 'cookie-parser';
import * as cors from "cors";
import * as compress from "compression";
import * as methodOverride from "method-override";

export const middlewares: any[] = [];


if (process.env.NODE_ENV === "production") {
    middlewares.push(cors({
        origin: [
            "http://elyspio.fr",
        ],
        credentials: true,
        exposedHeaders: ["set-cookie"],
    }),)
} else {
    middlewares.push(cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:3001",
        ],
        credentials: true,
        exposedHeaders: ["set-cookie"],
    }))
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

