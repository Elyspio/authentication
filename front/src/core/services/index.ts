import { AuthenticationService } from "./authentication";
import { LocalStorageService } from "./localStorage";
import { ThemeService } from "./theme";
import { UserService } from "./user";

export const Services = {
	authentication: new AuthenticationService(),
	user: new UserService(),
	localStorage: {
		settings: new LocalStorageService("elyspio-authentication-settings"),
		validation: new LocalStorageService("elyspio-authentication-validation"),
	},
	theme: new ThemeService(),
};
