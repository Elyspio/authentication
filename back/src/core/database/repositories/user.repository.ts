import {AfterRoutesInit, Service} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {Connection} from "typeorm"
import {getLogger} from "../../utils/logger";
import {Log} from "../../utils/decorators/logger";
import {UserEntity} from "../entities/user/user.entity";

@Service()
export class UserRepository implements AfterRoutesInit {
	private static log = getLogger.service(UserRepository);
	private connection: Connection;

	constructor(private typeORMService: TypeORMService) {

	}

	$afterRoutesInit() {
		this.connection = this.typeORMService.get("postgres")!; // get connection by name
	}

	@Log(UserRepository.log)
	async create(user: UserEntity): Promise<UserEntity> {
		await this.connection.manager.save(user);
		return user;
	}

	@Log(UserRepository.log)
	async findByUsername(username: string): Promise<UserEntity | undefined> {
		const connections = await this.connection.manager.findOne(UserEntity, {where: {username}});
		console.log("Loaded connections: ", connections);
		return connections;
	}

	@Log(UserRepository.log)
	async findActiveConnection(username: string): Promise<UserEntity | undefined> {
		return await this.connection.manager.findOne(UserEntity, {
			where: {
				username,
				expire: {
					$lt: new Date()
				}
			}
		});
	}

}
