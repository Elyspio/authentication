import { inject, injectable } from "inversify";
import { BackendApi } from "../apis/backend";
import { BaseService } from "./common/base.service";
import Sha from "jssha";
import { User } from "../apis/backend/generated";

@injectable()
export class AuthenticationService extends BaseService {
	@inject(BackendApi)
	private backendApi!: BackendApi;

	public async register(name: string, password: string) {
		const { salt } = await this.backendApi.authentication.initRegister(name);

		const hash = this.computeHash(name, password, salt);

		await this.backendApi.authentication.register(name, hash);
	}

	public async login(name: string, password: string) {
		const { salt, challenge } = await this.backendApi.authentication.initLogin(name);

		const hash = this.computeHash(name, password, salt);

		const challengedHash = this.computeHash(hash, challenge);

		let jwt = await this.backendApi.authentication.login(name, challengedHash);
		return {
			jwt,
			data: this.parseJwt(jwt),
		};
	}

	private computeHash(...args: string[]) {
		const encoder = new Sha("SHA3-512", "TEXT", { encoding: "UTF8" });
		encoder.update(args.join(""));
		return encoder.getHash("B64");
	}

	private parseJwt(token: string): User {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		const jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split("")
				.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
				.join("")
		);

		return JSON.parse(jsonPayload).data;
	}
}
