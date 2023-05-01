import { AuthenticationService } from "@services/authentication.service";
import { ThemeService } from "@services/common/theme.service";
import { LocalStorageService } from "@services/common/localStorage.service";
import { DiKeysService } from "./di.keys.service";
import { Container } from "inversify";
import { UsersService } from "@services/users.service";
import { TokenService } from "@services/token.service";
import { UpdateSocketService } from "@services/socket/update.socket.service";

export const addServices = (container: Container) => {
	container.bind(AuthenticationService).toSelf();
	container.bind(ThemeService).toSelf();
	container.bind(UsersService).toSelf();
	container.bind(TokenService).toSelf();
	container.bind(UpdateSocketService).toSelf();
	container.bind<LocalStorageService>(DiKeysService.localStorage.jwt).toConstantValue(new LocalStorageService("authentication:jwt"));
};
