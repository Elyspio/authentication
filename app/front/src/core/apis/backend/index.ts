import { inject, injectable } from "inversify";
import axios from "axios";
import { AuthenticationClient, JwtClient, UsersClient } from "./generated";
import { TokenService } from "../../services/token.service";

const basePath = window.config.endpoints.core;

@injectable()
export class BackendApi {
	public authentication: AuthenticationClient;
	public users: UsersClient;
	public jwt: JwtClient;

	constructor(@inject(TokenService) tokenService: TokenService) {
		const instance = axios.create({ withCredentials: true, transformResponse: [] });

		instance.interceptors.request.use((value) => {
			value.headers!["Authorization"] = `Bearer ${tokenService.getToken()}`;
			return value;
		});

		this.authentication = new AuthenticationClient(basePath, instance);
		this.users = new UsersClient(basePath, instance);
		this.jwt = new JwtClient(basePath, instance);
	}
}
