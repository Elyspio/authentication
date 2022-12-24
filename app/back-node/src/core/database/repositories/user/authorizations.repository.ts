import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { MongoRepository } from "typeorm";
import { getLogger } from "../../../utils/logger";
import { Log } from "../../../utils/decorators/logger";
import { UserEntity } from "../../entities/user/user.entity";
import { UserNotFound } from "../../../services/authentication/authentication.errors";
import { AuthorizationEntity } from "../../entities/user/authorization/authorization.entity";

@Service()
export class AuthorizationsRepository implements AfterRoutesInit {
	private static log = getLogger.repository(AuthorizationsRepository);
	private repo!: { user: MongoRepository<UserEntity> };

	constructor(private typeORMService: TypeORMService) {}

	$afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			user: connection.getMongoRepository(UserEntity),
		};
	}

	@Log(AuthorizationsRepository.log)
	async updateByUsername(username: string, authorization: AuthorizationEntity): Promise<AuthorizationEntity> {
		const [user] = await this.repo.user.find({ where: { username } });
		user.authorizations = authorization;
		await this.repo.user.save(user);
		return user.authorizations;
	}

	@Log(AuthorizationsRepository.log)
	async findByUsername(username: string): Promise<AuthorizationEntity> {
		const user = await this.repo.user.findOne({
			where: {
				username,
			},
		});
		if (!user) throw UserNotFound(username);
		return user.authorizations;
	}
}
