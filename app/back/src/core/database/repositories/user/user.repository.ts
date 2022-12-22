import {AfterRoutesInit, Service} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {MongoRepository} from "typeorm";
import {getLogger} from "../../../utils/logger";
import {Log} from "../../../utils/decorators/logger";
import {UserEntity} from "../../entities/user/user.entity";
import {UserTheme} from "../../entities/user/settings.entity";
import {Roles} from "../../entities/user/authorization/authentication.entity";

@Service()
export class UserRepository implements AfterRoutesInit {
	private static log = getLogger.repository(UserRepository);
	private repo!: { user: MongoRepository<UserEntity> };

	constructor(private typeORMService: TypeORMService) {
	}

	$afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			user: connection.getMongoRepository(UserEntity),
		};
	}

	@Log(UserRepository.log)
	async create(username: string, hash: string): Promise<UserEntity> {

		const userRoles = [Roles.User];


		if (!await this.checkIfUsersExist()) userRoles.push(Roles.Admin)

		return await this.repo.user.save({
			username,
			hash,
			settings: {
				theme: UserTheme.System,
			},
			credentials: {},
			authorizations: {
				authentication: {
					roles: userRoles,
				},
			},
		});
	}

	@Log(UserRepository.log)
	async findByUsername(username: string): Promise<UserEntity | undefined> {
		return await this.repo.user.findOne({
			where: {username},
		});
	}

	@Log(UserRepository.log)
	public async checkIfUsersExist() {
		const users = await this.repo.user.findOne();
		return Boolean(users);
	}
}
