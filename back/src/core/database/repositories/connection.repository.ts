import {AfterRoutesInit, Service} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {MongoRepository, MoreThan} from "typeorm"
import {ConnectionEntity} from "../entities/connection.entity";
import {token_expiration} from "../../../config/authentication";
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
		const obj = new ConnectionEntity();
		Object.assign(obj, {
			...user,
			created: new Date(),
			expire: new Date(Date.now() + token_expiration),
			invalidated: false
		})
		return this.repo.connection.save(obj);
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
				username: {$eq: username},
				expire: {$lt: new Date()},
				invalidated: {$eq: false}
			}
		});
	}

	@Log.service(ConnectionRepository.log)
	async findActiveConnections(): Promise<ConnectionEntity[]> {
		return await this.repo.connection.find({
			where: {
				expire: MoreThan(new Date()),
				invalidated: false
			}
		});
	}

	@Log.service(ConnectionRepository.log)
	async invalidateConnection(username: ConnectionEntity["username"]) {
		return await this.repo.connection.updateOne({
			username,
		}, {
			invalidated: true
		})
	}


	private async findByUsername(username: string) {
		return this.repo.connection.findOne({
			where: {
				username
			}
		})
	}
}
