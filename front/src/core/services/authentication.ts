import md5 from "md5"
import {Apis} from "../apis";

export class AuthenticationService {

	public async login({name, password}: { name: string, password: string }): Promise<{
		success: boolean,
		token?: string
	}> {
		const ownHash = md5(name + password)
		try {
			const salt = (await Apis.authentication.loginInit({name: name})).data.salt
			const hash = md5(ownHash + salt);
			const res = (await Apis.authentication.login({name: name, hash}));
			if (res.status === 200) return {success: true, token: res.data.token}
		} catch (e) {
			console.error("ERROR in isAuthorized", e);
		}
		return {success: false};
	}

	public async isValid() {
		const {data} = await Apis.authentication.validToken()
		return data;
	}

	public async logout() {
		await Apis.authentication.logout();
	}

	public async getUsername() {
		const {data} = await Apis.users.getCookieInfo("username");
		return data;
	}


	public async getSettings(username: string) {
		const {data} = await Apis.users.getUserSettings(username);
		return data
	}


	public async getCredentials(username: string) {
		const {data} = await Apis.users.getUserCredentials(username);
		return data
	}

}
