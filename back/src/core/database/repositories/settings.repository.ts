import {AfterRoutesInit, Service} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {Connection} from "typeorm"
import {getLogger} from "../../utils/logger";
import {Log} from "../../utils/decorators/logger";
import {SettingsEntity} from "../entities/user/settings.entity";
import {SetUserSettingsModel} from "../../../web/controllers/users/users.model";

@Service()
export class SettingRepository implements AfterRoutesInit {
	private static log = getLogger.service(SettingRepository);
	private connection: Connection;

	constructor(private typeORMService: TypeORMService) {

	}

	$afterRoutesInit() {
		this.connection = this.typeORMService.get("postgres")!; // get connection by name
	}

	@Log(SettingRepository.log)
	async create(user: SettingsEntity): Promise<SettingsEntity> {
		await this.connection.manager.save<SettingsEntity>(user);
		return user;
	}

	@Log(SettingRepository.log)
	async updateByUsername(username: string, settings: SetUserSettingsModel): Promise<SettingsEntity> {
		const actualSettings = await this.findByUsername(username);
		Object.assign(actualSettings, settings);
		return this.connection.manager.save<SettingsEntity>(actualSettings)
	}

	@Log(SettingRepository.log)
	async findByUsername(username: string): Promise<SettingsEntity | undefined> {
		return await this.connection.manager.findOne(SettingsEntity, {
			where: {
				user: {
					username
				},
			}
		});
	}

}
