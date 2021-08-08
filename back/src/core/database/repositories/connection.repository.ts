import {AfterRoutesInit, Service} from "@tsed/common";
import {TypeORMService} from "@tsed/typeorm";
import {Connection, LessThan, MoreThan} from "typeorm"
import {ConnectionEntity} from "../entities/connection.entity";
import {token_expiration} from "../../../config/authentication";
import {getLogger} from "../../utils/logger";
import {Log} from "../../utils/decorators/logger";

@Service()
export class ConnectionRepository implements AfterRoutesInit {
	private static log = getLogger.service(ConnectionRepository);
	private connection: Connection;

	constructor(private typeORMService: TypeORMService) {

	}

	$afterRoutesInit() {
		this.connection = this.typeORMService.get("postgres")!; // get connection by name
	}

	@Log(ConnectionRepository.log)
	async create(user: Omit<ConnectionEntity, "created" | "invalidated" | "expire" | "id">): Promise<ConnectionEntity> {
		const obj = new ConnectionEntity();
		Object.assign(obj, {
			...user,
			created: new Date(),
			expire: new Date(Date.now() + token_expiration),
			invalidated: false
		})
		return this.connection.manager.save(obj);
	}

	@Log(ConnectionRepository.log)
	async find(): Promise<ConnectionEntity[]> {
		const connections = await this.connection.manager.find(ConnectionEntity);
		console.log("Loaded connections: ", connections);
		return connections;
	}

	@Log(ConnectionRepository.log)
	async findActiveConnection(username: string): Promise<ConnectionEntity | undefined> {
		return await this.connection.manager.findOne(ConnectionEntity, {
			where: {
				username,
				expire: LessThan(new Date()),
				invalidated: false
			}
		});
	}

	@Log(ConnectionRepository.log)
	async findActiveConnections(): Promise<ConnectionEntity[]> {
		return await this.connection.manager.find(ConnectionEntity, {
			where: {
				expire: MoreThan(new Date()),
				invalidated: false
			}
		});
	}

	@Log(ConnectionRepository.log)
	async invalidateConnection(username: ConnectionEntity["username"]) {
		const con = await this.findByUsername(username)
		const obj = new ConnectionEntity();
		Object.assign(obj, {
			...con,
			invalidated: true
		})
		return await this.connection.manager.save(obj);
	}

	private async findByUsername(username: string) {
		return this.connection.manager.findOne(ConnectionEntity, {
			where: {
				username
			}
		})
	}
}
