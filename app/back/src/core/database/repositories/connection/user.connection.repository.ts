import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { MongoRepository } from "typeorm";
import { UserConnectionEntity } from "../../entities/connection/user.connection.entity";
import { getLogger } from "../../../utils/logger";
import { Log } from "../../../utils/decorators/logger";

@Service()
export class UserConnectionRepository implements AfterRoutesInit {
	private static log = getLogger.repository(UserConnectionRepository);
	private repo!: { connection: MongoRepository<UserConnectionEntity> };

	constructor(private typeORMService: TypeORMService) {}

	$afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			connection: connection.getMongoRepository(UserConnectionEntity),
		};
	}

	@Log.service(UserConnectionRepository.log)
	async create(user: Omit<UserConnectionEntity, "created" | "invalidated" | "expire" | "id">): Promise<UserConnectionEntity> {
		return this.repo.connection.save(new UserConnectionEntity(user.username, user.token, user.salt));
	}

	@Log.service(UserConnectionRepository.log)
	async find(): Promise<UserConnectionEntity[]> {
		const connections = await this.repo.connection.find();
		console.log("Loaded connection: ", connections);
		return connections;
	}

	@Log.service(UserConnectionRepository.log)
	async findActiveConnection(username: string): Promise<UserConnectionEntity | undefined> {
		return await this.repo.connection.findOne({
			where: {
				username,
				invalidated: false,
				expire: {
					$gt: new Date(),
				},
			},
		});
	}

	@Log.service(UserConnectionRepository.log)
	async findActiveConnections(): Promise<UserConnectionEntity[]> {
		return await this.repo.connection.find({
			where: {
				invalidated: false,
				expire: {
					$gt: new Date(),
				},
			},
		});
	}

	@Log.service(UserConnectionRepository.log)
	async invalidateConnection(username: UserConnectionEntity["username"]) {
		const activeConnections = await this.findActiveConnection(username);

		if (activeConnections) {
			return await this.repo.connection.update(
				{
					username,
					id: activeConnections.id,
				},
				{
					invalidated: true,
				}
			);
		}
	}
}
