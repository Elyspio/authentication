import { inject, injectable } from "inversify";
import { BackendApi } from "../apis/backend";
import { BaseService } from "./common/base.service";
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
		const { salt, challenge } = await this.backendApi.authentication.initVerify(name);

		const hash = this.computeHash(name, password, salt);

		const challengedHash = this.computeHash(hash, challenge);

		await this.backendApi.authentication.verify(name, challengedHash);
	}

	private computeHash(...args: string[]) {
		const encoder = new Sha("SHA3-512", "TEXT", { encoding: "UTF8" });
		encoder.update(args.join(""));
		return encoder.getHash("B64");
	}
}
