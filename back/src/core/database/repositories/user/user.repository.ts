import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { MongoRepository } from "typeorm";
import { getLogger } from "../../../utils/logger";
import { Log } from "../../../utils/decorators/logger";
import { UserEntity } from "../../entities/user/user.entity";
import { UserTheme } from "../../entities/user/settings.entity";
import { Roles } from "../../entities/user/authorization/authentication.entity";

@Service()
export class UserRepository implements AfterRoutesInit {
	private static log = getLogger.repository(UserRepository);
	private repo!: { user: MongoRepository<UserEntity> };

	constructor(private typeORMService: TypeORMService) {}

	$afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			user: connection.getMongoRepository(UserEntity),
		};
	}

	@Log(UserRepository.log)
	async create(username: string, hash: string): Promise<UserEntity> {
		const user = await this.repo.user.save({
			username,
			hash,
			settings: {
				theme: UserTheme.System,
			},
			credentials: {},
			authorizations: {
				authentication: {
					roles: [Roles.User],
				},
			},
		});

		return user;
	}

	@Log(UserRepository.log)
	async findByUsername(username: string): Promise<UserEntity | undefined> {
		const connections = await this.repo.user.findOne({
			where: { username },
		});
		return connections;
	}

	@Log(UserRepository.log)
	public async checkIfUsersExist() {
		const users = await this.repo.user.findOne();
		return users !== null;
	}
}
