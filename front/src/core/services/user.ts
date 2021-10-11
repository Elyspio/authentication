import { Apis } from "../apis";
import { AuthorizationModel, CredentialsModel, SetUserSettingsModel } from "../apis/backend";

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

	public readonly authorizations = {
		get: this.getAuthorizations,
		set: this.setAuthorizations,
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

	private async getAuthorizations(username: string) {
		const { data } = await Apis.users.authorizations.get(username);
		return data;
	}

	private async setAuthorizations(username: string, credential: AuthorizationModel) {
		const { data } = await Apis.users.authorizations.set(username, credential);
		return data;
	}
}
