import { inject, injectable } from "inversify";
import { BaseService } from "./common/base.service";
import { User } from "../apis/backend/generated";
import { LocalStorageService } from "./common/localStorage.service";
import { DiKeysService } from "../di/services/di.keys.service";

@injectable()
export class TokenService extends BaseService {
	@inject(DiKeysService.localStorage.jwt)
	private localStorage!: LocalStorageService;

	public parseJwt(token: string): User {
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

	public getToken() {
		return this.localStorage.get<string>();
	}

	public setToken(token: string) {
		return this.localStorage.set(token);
	}

	public delete() {
		this.localStorage.remove();
	}
}
