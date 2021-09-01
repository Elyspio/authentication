import {Service} from "@tsed/common";
import {ConnectionRepository} from "../../database/repositories/connection.repository";
import {getLogger} from "../../utils/logger";
import {Log} from "../../utils/decorators/logger";
import {UserRepository} from "../../database/repositories/user.repository";
import {FrontThemes, SetUserSettingsModel} from "../../../web/controllers/users/users.model";
import {SettingRepository} from "../../database/repositories/settings.repository";
import {UserNotFound} from "../authentication/authentication.errors";

@Service()
export class UserService {

	private static log = getLogger.service(UserService);
	private repositories: { setting: SettingRepository; connection: ConnectionRepository; user: UserRepository };

	constructor(connectionRepository: ConnectionRepository, userRepository: UserRepository, userSettingRepository: SettingRepository) {
		this.repositories = {
			connection: connectionRepository,
			user: userRepository,
			setting: userSettingRepository
		}
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
		return await this.repositories.setting.updateByUsername(username, settings)
	}

	async getUserTheme(username: string, windowsTheme: FrontThemes) {
		const user = await this.repositories.user.findByUsername(username);
		if (!user) throw UserNotFound(username);
		if (user.settings.theme === "system") return windowsTheme;
		else return user.settings.theme as unknown as FrontThemes
	}


	async createUser(username: string, hash: string) {
		await this.repositories.user.create(username, hash)
	}
}