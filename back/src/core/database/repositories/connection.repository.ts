import {AfterRoutesInit, Service} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {MongoRepository} from "typeorm"
import {ConnectionEntity} from "../entities/connection.entity";
import {getLogger} from "../../utils/logger";
import {Log} from "../../utils/decorators/logger";

@Service()
export class ConnectionRepository implements AfterRoutesInit {
	private static log = getLogger.repository(ConnectionRepository);
	private repo!: { connection: MongoRepository<ConnectionEntity> };

	constructor(private typeORMService: TypeORMService) {
	}

	$afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			connection: connection.getMongoRepository(ConnectionEntity)
		}
	}

	@Log.service(ConnectionRepository.log)
	async create(user: Omit<ConnectionEntity, "created" | "invalidated" | "expire" | "id">): Promise<ConnectionEntity> {
		return this.repo.connection.save(new ConnectionEntity(user.username, user.token, user.salt));
	}

	@Log.service(ConnectionRepository.log)
	async find(): Promise<ConnectionEntity[]> {
		const connections = await this.repo.connection.find();
		console.log("Loaded connections: ", connections);
		return connections;
	}

	@Log.service(ConnectionRepository.log)
	async findActiveConnection(username: string): Promise<ConnectionEntity | undefined> {
		return await this.repo.connection.findOne({
			where: {
				username,
				invalidated: false,
				expire: {
					$gt: new Date()
				},
			}
		});
	}

	@Log.service(ConnectionRepository.log)
	async findActiveConnections(): Promise<ConnectionEntity[]> {
		return await this.repo.connection.find({
			where: {
				invalidated: false,
				expire: {
					$gt: new Date()
				},
			}
		});
	}

	@Log.service(ConnectionRepository.log)
	async invalidateConnection(username: ConnectionEntity["username"]) {

		const activeConnections = await this.findActiveConnection(username);

		if (activeConnections) {
			return await this.repo.connection.update({
				username,
				id: activeConnections.id

			}, {
				invalidated: true
			})
		}


	}
}
