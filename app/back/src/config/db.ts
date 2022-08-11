import {ConnectionOptions} from "typeorm";
import "@tsed/typeorm";
import {Helper} from "../core/utils/helper";
import {database} from "./external.json"
import isDev = Helper.isDev;

export const databaseConfig: ConnectionOptions[] = [
    {
        name: "db",
        type: "mongodb",
        host: database.host,
        port: database.port,
        username: database.username,
        password: database.password,
        database: database.database,
        extra: {
            authSource: database.authSource,
        },
        synchronize: true,
        logging: isDev(),
        entities: [`${__dirname}/../core/database/entities/*{.ts,.js}`, `${__dirname}/../core/database/entities/**/*{.ts,.js}`],
    },
];
