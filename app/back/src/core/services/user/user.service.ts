import { Service } from "@tsed/common";
import { UserConnectionRepository } from "../../database/repositories/connection/user.connection.repository";
import { getLogger } from "../../utils/logger";
import { Log } from "../../utils/decorators/logger";
import { UserRepository } from "../../database/repositories/user/user.repository";
import { AuthorizationModel, FrontThemes, SetUserSettingsModel } from "../../../web/controllers/users/users.model";
import { SettingRepository } from "../../database/repositories/user/settings.repository";
import { UserNotFound } from "../authentication/authentication.errors";
import { CredentialsRepository } from "../../database/repositories/user/credentials.repository";
import { CredentialsEntity } from "../../database/entities/user/credentials/credentials.entity";
import { AuthorizationsRepository } from "../../database/repositories/user/authorizations.repository";

@Service()
export class UserService {
	private static log = getLogger.service(UserService);
	private repositories: {
		credentials: CredentialsRepository;
		connection: UserConnectionRepository;
		user: UserRepository;
		setting: SettingRepository;
		authorization: AuthorizationsRepository;
	};

	constructor(
		connectionRepository: UserConnectionRepository,
		userRepository: UserRepository,
		userSettingRepository: SettingRepository,
		userCredentialRepository: CredentialsRepository,
		authorizationsRepository: AuthorizationsRepository
	) {
		this.repositories = {
			connection: connectionRepository,
			user: userRepository,
			setting: userSettingRepository,
			credentials: userCredentialRepository,
			authorization: authorizationsRepository,
		};
	}

	@Log(UserService.log)
	public async getUserCredentials(username: string) {
		const user = await this.repositories.user.findByUsername(username);
		if (!user) throw UserNotFound(username);
		return user.credentials;
	}

	@Log(UserService.log)
	public async getAccountSettings(username: string) {
		const user = await this.repositories.user.findByUsername(username);
		if (!user) throw UserNotFound(username);
		return user.settings;
	}

	@Log(UserService.log)
	async setAccountSettings(username: string, settings: SetUserSettingsModel) {
		return await this.repositories.setting.updateByUsername(username, settings);
	}

	@Log(UserService.log)
	async getUserTheme(username: string, windowsTheme: FrontThemes) {
		const user = await this.repositories.user.findByUsername(username);
		if (!user) throw UserNotFound(username);
		if (user.settings.theme === "system") return windowsTheme;
		else return user.settings.theme as unknown as FrontThemes;
	}

	@Log(UserService.log)
	async createUser(username: string, hash: string) {
		await this.repositories.user.create(username, hash);
	}

	@Log(UserService.log)
	public async setUserCredentials(username: string, settings: CredentialsEntity) {
		return await this.repositories.credentials.updateByUsername(username, settings);
	}

	@Log(UserService.log)
	async getUserAuthorisations(username: string) {
		const user = await this.repositories.user.findByUsername(username);
		if (!user) throw UserNotFound(username);
		else return user.authorizations;
	}

	@Log(UserService.log)
	public async setUserAuthorisation(username: string, authorization: AuthorizationModel) {
		return await this.repositories.authorization.updateByUsername(username, authorization);
	}

	@Log(UserService.log)
	public async checkIfUsersExist() {
		return await this.repositories.user.checkIfUsersExist();
	}
}
