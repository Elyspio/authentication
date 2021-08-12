import {Apis} from "../apis";
import {SetUserSettingsModel} from "../apis/backend";

export class UserService {


	public readonly username = {
		get: this.getUsername,
	}

	public readonly credentials = {
		get: this.getCredentials,
	}

	public readonly settings = {
		get: this.getSettings,
		set: this.setSettings
	}


	private async getUsername() {
		const {data} = await Apis.users.getCookieInfo("username");
		return data;
	}


	private async getSettings(username: string) {
		const {data} = await Apis.users.getUserSettings(username);
		return data
	}

	private async setSettings(username: string, settings: SetUserSettingsModel) {
		await Apis.users.setUserSettings(username, settings);
	}


	private async getCredentials(username: string) {
		const {data} = await Apis.users.getUserCredentials(username);
		return data
	}
}
