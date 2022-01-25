import { AuthenticationApi, AuthorisationsUsersApi, CredentialsUsersApi, SettingsUsersApi, UsersApi } from "./backend";
import axios from "axios";

const instance = axios.create({ withCredentials: true });

const basePath = window.config.endpoints.core;

export const Apis = {
	authentication: new AuthenticationApi(undefined, basePath, instance),
	users: {
		core: new UsersApi(undefined, basePath, instance),
		settings: new SettingsUsersApi(undefined, basePath, instance),
		credentials: new CredentialsUsersApi(undefined, basePath, instance),
		authorizations: new AuthorisationsUsersApi(undefined, basePath, instance),
	},
};
