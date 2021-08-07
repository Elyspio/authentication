import {Service} from "@tsed/common";
import {ConnectionRepository} from "../../database/repositories/connection.repository";
import {getLogger} from "../../utils/logger";
import {Log} from "../../utils/decorators/logger";
import {UserRepository} from "../../database/repositories/user.repository";

@Service()
export class UserService {

	private static log = getLogger.service(UserService);
	private repositories: { connection: ConnectionRepository; user: UserRepository };

	constructor(connectionRepository: ConnectionRepository, userRepository: UserRepository) {
		this.repositories = {
			connection: connectionRepository,
			user: userRepository
		}
	}

	@Log(UserService.log)
	public async getAccountData(username: string) {
		const user = await this.repositories.user.findByUsername(username);
		return user.credentials;
	}


	@Log(UserService.log)
	public async getAccountSettings(username: string) {
		const user = await this.repositories.user.findByUsername(username);
		return user.settings;
	}
}
