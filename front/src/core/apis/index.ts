import {AuthenticationApi} from "./backend"


export const Apis = {
	authentication: new AuthenticationApi(undefined, window.config.endpoints.core)
}




