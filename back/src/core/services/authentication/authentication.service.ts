import * as md5 from "md5";
import { AppTokenNotFound, UserNotFound } from "./authentication.errors";
import { token_expiration } from "../../../config/authentication";
import { $log, AfterRoutesInit, Service } from "@tsed/common";
import { PostLoginRequest } from "../../../web/controllers/authentication/authentication.models";
import * as crypto from "crypto";
import { UserConnectionRepository } from "../../database/repositories/connection/user.connection.repository";
import { getLogger } from "../../utils/logger";
import { Log } from "../../utils/decorators/logger";
import { UserRepository } from "../../database/repositories/user/user.repository";
import { AppConnectionRepository } from "../../database/repositories/connection/app.connection.repository";

@Service()
export class AuthenticationService implements AfterRoutesInit {
	private static log = getLogger.service(AuthenticationService);
	private users: { [p: string]: { salt: string; token?: string } } = {};
	private apps: { [p: string]: string[] } = {};
	private repositories: { connection: UserConnectionRepository; user: UserRepository; appConnection: AppConnectionRepository };

	constructor(connectionRepository: UserConnectionRepository, userRepository: UserRepository, appConnectionRepository: AppConnectionRepository) {
		this.repositories = {
			connection: connectionRepository,
			user: userRepository,
			appConnection: appConnectionRepository,
		};
	}

	@Log(AuthenticationService.log)
	async $afterRoutesInit() {
		const activeConnection = await this.repositories.connection.findActiveConnections();
		for (const con of activeConnection) {
			this.users[con.username] = { token: con.token, salt: con.salt };
		}

		const activeAppConnection = await this.repositories.appConnection.findActiveConnections();
		for (const con of activeAppConnection) {
			if (this.apps[con.app] === undefined) this.apps[con.app] = [];
			this.apps[con.app].push(con.token);
		}
	}

	// region User

	@Log(AuthenticationService.log)
	public async initLogin(username: string): Promise<string> {
		const salt = crypto.randomBytes(16).toString("hex");

		this.users[username] = {
			salt,
		};
		return salt;
	}

	@Log(AuthenticationService.log)
	public validateToken(token: string) {
		return Object.values(this.users).some((usr) => usr.token === token);
	}

	@Log(AuthenticationService.log)
	public async verifyLogin(user: PostLoginRequest) {
		const salt = this.users[user.name].salt;

		$log.debug("verify", { user, users: this.users });

		let userStored = await this.repositories.user.findByUsername(user.name);

		if (userStored === undefined) {
			throw UserNotFound(user.name);
		}

		const userStoredHash = userStored.hash;

		if (userStoredHash === undefined) {
			throw UserNotFound(user.name);
		}
		const isAuthorized = user.hash === md5(userStoredHash + salt);
		if (isAuthorized) {
			let token = this.generateToken();
			this.users[user.name] = {
				...this.users[user.name],
				token,
			};

			await this.repositories.connection.create({
				username: user.name,
				token,
				salt,
			});

			setTimeout(() => {
				this.logout(user.name);
			}, token_expiration);
		}
		return { authorized: isAuthorized, token: this.users[user.name].token };
	}

	@Log(AuthenticationService.log)
	public async logout(username: string) {
		delete this.users[username];
		await this.repositories.connection.invalidateConnection(username);
	}

	@Log(AuthenticationService.log)
	public getLoggedUser() {
		return this.users;
	}

	@Log(AuthenticationService.log)
	public getUserFromToken(token: string) {
		return Object.entries(this.users)
			.map(([username, info]) => ({ username, token: info.token }))
			.find(({ token: t }) => t === token)!;
	}

	// endregion User

	// region App

	@Log(AuthenticationService.log)
	public async createAppToken(app: string, expire: boolean) {
		const token = this.generateToken();

		if (this.apps[app] === undefined) this.apps[app] = [token];
		else this.apps[app].push(token);
		await this.repositories.appConnection.create({ token, app }, expire);

		return token;
	}

	@Log(AuthenticationService.log)
	public async deleteAppToken(app: string, token: string) {
		if (this.apps[app] !== undefined) {
			this.apps[app] = this.apps[app].filter((t) => t !== token);
			await this.repositories.appConnection.invalidateConnections(app, token);
		} else {
			throw AppTokenNotFound(app);
		}
	}

	@Log(AuthenticationService.log)
	public getAppTokens(app: string) {
		return this.apps[app] ?? [];
	}

	@Log(AuthenticationService.log)
	public validateAppToken(app: string, token: string) {
		return this.apps[app]?.some((t) => t === token) ?? false;
	}

	// endregion App

	@Log(AuthenticationService.log)
	private async generateSalt() {
		return crypto.randomBytes(16).toString("hex");
	}

	@Log(AuthenticationService.log)
	private generateToken() {
		return crypto.randomBytes(64).toString("hex");
	}
}
