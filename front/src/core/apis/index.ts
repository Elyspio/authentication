import { AuthenticationApi, UsersApi, UsersAuthorisationsApi, UsersCredentialsApi, UsersSettingsApi } from "./backend";
import axios from "axios";

const instance = axios.create({ withCredentials: true });

const basePath = window.config.endpoints.core;

export const Apis = {
	authentication: new AuthenticationApi(undefined, basePath, instance),
	users: {
		core: new UsersApi(undefined, basePath, instance),
		settings: new UsersSettingsApi(undefined, basePath, instance),
		credentials: new UsersCredentialsApi(undefined, basePath, instance),
		authorizations: new UsersAuthorisationsApi(undefined, basePath, instance),
	},
};
