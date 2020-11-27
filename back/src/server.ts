import {Configuration, Inject} from "@tsed/di";
import {$log, PlatformApplication} from "@tsed/common";
import {middlewares} from "./middleware/common/raw";
import * as path from "path";
import "@tsed/swagger";

export const rootDir = __dirname;
let frontPath = path.resolve(...process.env.NODE_ENV === "production" ? [rootDir, "..", "front", "build"] : [rootDir, "..", "..", "front", "build"]);
$log.info("frontPath", frontPath)

@Configuration({
    rootDir,
    httpPort: process.env.HTTP_PORT || 4000,
    httpsPort: false, // CHANGE
    mount: {
        "/core": [
            `${rootDir}/controllers/**/*.ts`
        ]
    },
    exclude: [
        "**/*.spec.ts"
    ],
    statics: {
        "/": [
            {root: frontPath}
        ],
        "/authentication": [
            {root: frontPath}
        ]
    },
    swagger: [{
        path: "/swagger",
    }]
})
export class Server {

    @Inject()
    app: PlatformApplication;

    @Configuration()
    settings: Configuration;

    $beforeRoutesInit() {
        this.app.use(...middlewares)
        return null;
    }
}
