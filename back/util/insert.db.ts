import { UserEntity } from "../src/core/database/entities/user/user.entity";
import { Roles, RolesEntity } from "../src/core/database/entities/user/authorization/roles.entity";
import { createConnections } from "typeorm/globals";
import { UserTheme } from "../src/core/database/entities/user/settings.entity";
import { env } from "process";
import * as path from "path";

(async () => {
	const [con] = await Promise.all(
		await createConnections([
			{
				type: "mongodb",
				host: "127.0.0.1",
				port: 6001,
				username: env.DB_USERNAME ?? "root",
				password: env.DB_PASSWORD ?? "mysecretpassword",
				database: env.DB_DATABASE ?? "admin",
				synchronize: true,
				logging: true,
				entities: [path.resolve(__dirname, "..", "src/core/database/entities/**/*.ts"), path.resolve(__dirname, "..", "src/core/database/entities/*.ts")],
				migrations: ["src/core/database/migrations/**/*.ts", "src/core/database/migrations/*.ts"],
				subscribers: ["src/core/database/subscribers/**/*.ts", "src/core/database/subscribers/*.ts"],
			} as any,
		])
	);

	const userRepository = con.getMongoRepository(UserEntity); // you can also get it via getConnection().getRepository() or getManager().getRepository()
	const user = await userRepository.save({
		username: "Elyspio",
		hash: "bb7a67bddf50a128e69adaca0b5f0148",
		authorizations: {
			authentication: {
				roles: [new RolesEntity(Roles.User), new RolesEntity(Roles.Admin)],
			},
		},
		settings: {
			theme: UserTheme.System,
		},
		credentials: {
			github: {
				token: "fd0e15cacdea41b2a4f849ddd1db6a84f77b0d22",
				user: "Elyspio",
			},
			docker: {
				username: "elyspio",
				password: "MM%56.~Gg(T7G}D;?DG<'r(q@>D`",
			},
		},
	});

	await userRepository.save(user);
})();
