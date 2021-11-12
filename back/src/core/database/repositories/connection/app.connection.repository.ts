import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { MongoRepository } from "typeorm";
import { AppConnectionEntity } from "../../entities/connection/app.connection.entity";
import { getLogger } from "../../../utils/logger";
import { Log } from "../../../utils/decorators/logger";

@Service()
export class AppConnectionRepository implements AfterRoutesInit {
	private static log = getLogger.repository(AppConnectionRepository);
	private repo!: { appConnection: MongoRepository<AppConnectionEntity> };

	constructor(private typeORMService: TypeORMService) {}

	$afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			appConnection: connection.getMongoRepository(AppConnectionEntity),
		};
	}

	@Log.service(AppConnectionRepository.log)
	async create(user: Omit<AppConnectionEntity, "created" | "invalidated" | "expire" | "id">, expire: boolean): Promise<AppConnectionEntity> {
		return this.repo.appConnection.save(new AppConnectionEntity(user.app, user.token, expire));
	}

	@Log.service(AppConnectionRepository.log)
	async find(): Promise<AppConnectionEntity[]> {
		const connections = await this.repo.appConnection.find();
		console.log("Loaded app connection: ", connections);
		return connections;
	}

	@Log.service(AppConnectionRepository.log)
	async findActiveConnection(app: AppConnectionEntity["app"]): Promise<AppConnectionEntity[]> {
		return await this.repo.appConnection.find({
			where: {
				app,
				invalidated: false,
				expire: {
					$gt: new Date(),
				},
			},
		});
	}

	@Log.service(AppConnectionRepository.log)
	async findActiveConnections(): Promise<AppConnectionEntity[]> {
		return await this.repo.appConnection.find({
			where: {
				invalidated: false,
				expire: {
					$gt: new Date(),
				},
			},
		});
	}

	@Log.service(AppConnectionRepository.log)
	async invalidateConnections(app: AppConnectionEntity["app"], token: AppConnectionEntity["token"]) {
		const connections = await this.findActiveConnection(app);

		if (connections.length) {
			await Promise.all(
				connections.map((con) => {
					return this.repo.appConnection.update(
						{
							app,
							token,
							id: con.id,
						},
						{
							invalidated: true,
						}
					);
				})
			);
		}
	}
}
