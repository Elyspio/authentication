import { ConnectionOptions } from "typeorm";
import "@tsed/typeorm";
import { env } from "process";
import { Helper } from "../core/utils/helper";
import isDev = Helper.isDev;

export const databaseConfig: ConnectionOptions[] = [
	{
		name: "db",
		type: "mongodb",
		host: env.DB_HOST ?? "127.0.0.1",
		port: env.DB_PORT ? Number.parseInt(env.DB_PORT) : 6003,
		username: env.DB_USERNAME ?? "root",
		password: env.DB_PASSWORD ?? "root",
		database: env.DB_DATABASE ?? "authentication",
		extra: {
			authSource: "admin",
		},
		synchronize: true,
		logging: isDev(),
		entities: [`${__dirname}/../core/database/entities/*{.ts,.js}`, `${__dirname}/../core/database/entities/**/*{.ts,.js}`],
	},
];
