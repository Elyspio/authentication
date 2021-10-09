import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { MongoRepository } from "typeorm";
import { getLogger } from "../../utils/logger";
import { Log } from "../../utils/decorators/logger";
import { UserEntity } from "../entities/user/user.entity";
import { UserNotFound } from "../../services/authentication/authentication.errors";
import { CredentialsEntity } from "../entities/user/credentials/credentials.entity";

@Service()
export class CredentialsRepository implements AfterRoutesInit {
	private static log = getLogger.repository(CredentialsRepository);
	private repo!: { user: MongoRepository<UserEntity> };

	constructor(private typeORMService: TypeORMService) {}

	$afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			user: connection.getMongoRepository(UserEntity),
		};
	}

	@Log(CredentialsRepository.log)
	async updateByUsername(username: string, credentials: CredentialsEntity): Promise<CredentialsEntity> {
		const [user] = await this.repo.user.find({ where: { username } });
		user.credentials = credentials;
		await this.repo.user.save(user);
		return user.credentials;
	}

	@Log(CredentialsRepository.log)
	async findByUsername(username: string): Promise<CredentialsEntity> {
		const user = await this.repo.user.findOne({
			where: {
				username,
			},
		});
		if (!user) throw UserNotFound(username);
		return user.credentials;
	}
}
