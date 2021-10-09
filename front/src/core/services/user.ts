import { Apis } from "../apis";
import { CredentialsModel, SetUserSettingsModel } from "../apis/backend";

export class UserService {
	public readonly username = {
		get: this.getUsername,
	};

	public readonly credentials = {
		get: this.getCredentials,
		set: this.setCredentials,
	};

	public readonly settings = {
		get: this.getSettings,
		set: this.setSettings,
	};

	private async getUsername() {
		const { data } = await Apis.users.core.getUserInfo("username");
		return data;
	}

	private async getSettings(username: string) {
		const { data } = await Apis.users.settings.get(username);
		return data;
	}

	private async setSettings(username: string, settings: SetUserSettingsModel) {
		await Apis.users.settings.set(username, settings);
	}

	private async getCredentials(username: string) {
		const { data } = await Apis.users.credentials.get(username);
		return data;
	}

	private async setCredentials(username: string, credential: CredentialsModel) {
		const { data } = await Apis.users.credentials.set(username, credential);
		return data;
	}
}
