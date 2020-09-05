import E, {Express} from "express"
import {handleError, middlewares} from "./middleware/middleware";
import {ArgumentParser} from 'argparse'
import path from "path";
import {logger} from "./util/logger";
import {router} from "./routes/account";

const express = require('express');
export const app: Express = express();
app.use(...middlewares);

let frontPath = path.resolve(__dirname, "..", "front", "build");
logger.info("frontPath", {frontPath});
app.use("/", E.static(frontPath))
app.use('/core', router);


if (require.main === module) {
    const parser = new ArgumentParser();
    parser.add_argument("--port", {type: "int", default: 4000})
    const args: { port: number } = parser.parse_args();

    app.listen(args.port, () => {
        console.log("Starting server on port", args.port);
    })
}

app.use(handleError);
