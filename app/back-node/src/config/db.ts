import {ConnectionOptions} from "typeorm";
import "@tsed/typeorm";
import {Helper} from "../core/utils/helper";
import {database} from "./external.json"
import isDev = Helper.isDev;

export const databaseConfig: ConnectionOptions[] = [
    {
        name: "db",
        type: "mongodb",
        url: database,
        synchronize: true,
        logging: isDev(),
        entities: [`${__dirname}/../core/database/entities/*{.ts,.js}`, `${__dirname}/../core/database/entities/**/*{.ts,.js}`],
    },
];
