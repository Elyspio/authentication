import {AfterRoutesInit, Service} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {MongoRepository} from "typeorm"
import {getLogger} from "../../utils/logger";
import {Log} from "../../utils/decorators/logger";
import {SettingsEntity} from "../entities/user/settings.entity";
import {SetUserSettingsModel} from "../../../web/controllers/users/users.model";
import {UserEntity} from "../entities/user/user.entity";
import {UserNotFound} from "../../services/authentication/authentication.errors";

@Service()
export class SettingRepository implements AfterRoutesInit {
	private static log = getLogger.service(SettingRepository);
	private repo!: { user: MongoRepository<UserEntity> };

	constructor(private typeORMService: TypeORMService) {

	}

	$afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			user: connection.getMongoRepository(UserEntity)
		}
	}


	@Log(SettingRepository.log)
	async updateByUsername(username: string, settings: SetUserSettingsModel): Promise<SettingsEntity> {
		await this.repo.user.updateOne({
			username
		}, {
			settings
		})
		return this.findByUsername(username);
	}

	@Log(SettingRepository.log)
	async findByUsername(username: string): Promise<SettingsEntity> {
		const user = await this.repo.user.findOne({
			where: {
				username
			}
		});
		if (!user) throw UserNotFound(username);
		return user.settings;
	}

}
