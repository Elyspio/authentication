import * as md5 from "md5";
import {UserNotFound} from "./authentication.errors";
import {token_expiration} from "../../../config/authentication";
import {$log, AfterRoutesInit, Service} from "@tsed/common";
import {PostLoginRequest} from "../../../web/controllers/authentication/authentication.models";
import * as crypto from "crypto";
import {ConnectionRepository} from "../../database/repositories/connection.repository";
import {getLogger} from "../../utils/logger";
import {Log} from "../../utils/decorators/logger";
import {UserRepository} from "../../database/repositories/user.repository";

@Service()
export class AuthenticationService implements AfterRoutesInit {

	private static log = getLogger.service(AuthenticationService);
	private users: { [p: string]: { salt: string, token?: string } } = {};
	private repositories: { connection: ConnectionRepository; user: UserRepository };

	constructor(connectionRepository: ConnectionRepository, userRepository: UserRepository) {
		this.repositories = {
			connection: connectionRepository,
			user: userRepository
		}
	}

	@Log(AuthenticationService.log)
	async $afterRoutesInit() {
		const activeConnection = await this.repositories.connection.findActiveConnections();
		for (const con of activeConnection) {
			this.users[con.username] = {token: con.token, salt: con.salt}
		}
	}

	@Log(AuthenticationService.log)
	public async initLogin(username: string): Promise<string> {

		const salt = crypto.randomBytes(16).toString("hex");

		this.users[username] = {
			salt
		}
		return salt;
	}

	@Log(AuthenticationService.log)
	public validateToken(token: string) {
		return Object.values(this.users).some(usr => usr.token === token)
	}

	@Log(AuthenticationService.log)
	public async verifyLogin(user: PostLoginRequest) {

		const salt = this.users[user.name].salt;

		$log.debug("verify", {user, users: this.users})

		let userStored = await this.repositories.user.findByUsername(user.name)
		const userStoredHash = userStored.hash;

		if (userStoredHash === undefined) {
			throw UserNotFound(user.name)
		}
		const isAuthorized = user.hash === md5(userStoredHash + salt);
		if (isAuthorized) {
			let token = crypto.randomBytes(64).toString("hex");
			this.users[user.name] = {
				...this.users[user.name],
				token
			}

			await this.repositories.connection.create({
				username: user.name,
				token,
				salt
			});

			setTimeout(() => {
				this.logout(user.name);
			}, token_expiration)
		}
		return {authorized: isAuthorized, token: this.users[user.name].token};
	}

	@Log(AuthenticationService.log)
	public async logout(username: string) {
		delete this.users[username]
		await this.repositories.connection.invalidateConnection(username)
	}

	@Log(AuthenticationService.log)
	public getLoggedUser() {
		return this.users;
	}

	@Log(AuthenticationService.log)
	public getUserFromToken(token: string) {
		return Object.entries(this.users)
			.map(([username, info]) => ({username, token: info.token}))
			.find(({token: t}) => t === token)
	}

	@Log(AuthenticationService.log)
	private async generateSalt() {
		return crypto.randomBytes(16).toString("hex")
	}
}
