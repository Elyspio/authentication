import * as signalR from "@microsoft/signalr";
import { HubConnection, LogLevel } from "@microsoft/signalr";
import { User } from "@apis/backend/generated";
import { injectable } from "inversify";
import { BaseService } from "../technical/base.service";

interface UpdateHub extends HubConnection {
	on(event: "UserUpdated", callback: (user: User) => void): void;

	on(event: "UserDeleted", callback: (id: User["id"]) => void): void;
}

@injectable()
export class UpdateSocketService extends BaseService {
	async createSocket() {
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${window.config.endpoints.core}/ws/update`)
			.configureLogging(LogLevel.Information)
			.withAutomaticReconnect({ nextRetryDelayInMilliseconds: () => 5000 })
			.build();

		await connection.start();
		return connection as UpdateHub;
	}
}
