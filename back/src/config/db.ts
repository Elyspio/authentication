import {ConnectionOptions} from "typeorm";
import "@tsed/typeorm";
import {env} from "process";
import {Helper} from "../core/utils/helper";
import isDev = Helper.isDev;

export const databaseConfig: ConnectionOptions[] = [
	{
		name: "postgres",
		type: "postgres",
		host: env.DB_HOST ?? "127.0.0.1",
		port: env.DB_PORT ? Number.parseInt(env.DB_PORT) : 5432,
		username: env.DB_USERNAME ?? "postgres",
		password: env.DB_PASSWORD ?? "mysecretpassword",
		database: env.DB_DATABASE ?? "authentication",
		synchronize: isDev(),
		logging: isDev(),
		entities: [
			`${__dirname}/../core/database/entities/*{.ts,.js}`,
			`${__dirname}/../core/database/entities/**/*{.ts,.js}`
		],
		migrations: [
			`${__dirname}/../core/database/migrations/*{.ts,.js}`
		],
		subscribers: [
			`${__dirname}/../core/database/subscriber/*{.ts,.js}`
		]
	},
]
