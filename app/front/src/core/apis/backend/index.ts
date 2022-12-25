import { injectable } from "inversify";
import axios from "axios";
import { AuthenticationClient, UsersClient } from "./generated";

const instance = axios.create({ withCredentials: true, transformResponse: [] });

const basePath = window.config.endpoints.core;

@injectable()
export class BackendApi {
	public authentication = new AuthenticationClient(basePath, instance);
	public users = new UsersClient(basePath, instance);
}
