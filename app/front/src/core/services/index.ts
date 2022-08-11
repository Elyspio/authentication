import { AuthenticationService } from "./authentication.service";
import { LocalStorageService } from "./localStorage.service";
import { ThemeService } from "./theme.service";
import { UserService } from "./user.service";

export const Services = {
	authentication: new AuthenticationService(),
	user: new UserService(),
	localStorage: {
		settings: new LocalStorageService("elyspio-authentication-settings"),
		validation: new LocalStorageService("elyspio-authentication-validation"),
	},
	theme: new ThemeService(),
};
