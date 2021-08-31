import {AfterRoutesInit, Service} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {MongoRepository} from "typeorm"
import {getLogger} from "../../utils/logger";
import {Log} from "../../utils/decorators/logger";
import {UserEntity} from "../entities/user/user.entity";

@Service()
export class UserRepository implements AfterRoutesInit {
	private static log = getLogger.service(UserRepository);
	private repo: { user: MongoRepository<UserEntity> };

	constructor(private typeORMService: TypeORMService) {

	}

	$afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			user: connection.getMongoRepository(UserEntity)
		}
	}

	@Log(UserRepository.log)
	async create(user: UserEntity): Promise<UserEntity> {
		await this.repo.user.save(user);
		return user;
	}

	@Log(UserRepository.log)
	async findByUsername(username: string): Promise<UserEntity | undefined> {
		const connections = await this.repo.user.findOne({
			where: {username}
		});
		console.log("Loaded connections: ", connections);
		return connections;
	}

}
