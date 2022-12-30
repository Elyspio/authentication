import { inject, injectable } from "inversify";
import { BackendApi } from "../apis/backend";
import { BaseService } from "./technical/base.service";
import Sha from "jssha";

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

		return await this.backendApi.authentication.login(name, challengedHash);
	}

	public async changePassword(name: string, password: string) {
		const { salt } = await this.backendApi.authentication.initChangePassword(name);

		const hash = this.computeHash(name, password, salt);

		await this.backendApi.authentication.changePassword(name, hash);
	}

	public isValid() {
		return this.backendApi.authentication.verify();
	}

	private computeHash(...args: string[]) {
		const encoder = new Sha("SHA3-512", "TEXT", { encoding: "UTF8" });
		encoder.update(args.join(""));
		return encoder.getHash("B64");
	}
}
