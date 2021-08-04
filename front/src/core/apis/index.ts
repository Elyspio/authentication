import {AuthenticationApi, UsersApi} from "./backend"


export const Apis = {
	authentication: new AuthenticationApi(undefined, window.config.endpoints.core),
	users: new UsersApi(undefined, window.config.endpoints.core)
}




