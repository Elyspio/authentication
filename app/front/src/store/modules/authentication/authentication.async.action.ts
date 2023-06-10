import { StoreState } from "@store";
import { createAsyncActionGenerator, getService } from "../../utils/utils.actions";
import { UsersService } from "@services/users.service";
import { LocalStorageService } from "@services/common/localStorage.service";
import { DiKeysService } from "@/core/di/services/di.keys.service";
import { AuthenticationService } from "@services/authentication.service";
import { toast } from "react-toastify";
import { TokenService } from "@services/token.service";
import { setUserFromToken } from "./authentication.action";
import { changeLocation } from "@services/router.service";
import { AxiosError } from "axios";
import * as HttpStatusCode from "http-status";
import { goBack } from "redux-first-history";

const createAsyncThunk = createAsyncActionGenerator("authentication");

export const register = createAsyncThunk("register", async (_, { extra, getState, dispatch }) => {
	const {
		authentication: { username, password, user },
	} = getState() as StoreState;

	const service = getService(AuthenticationService, extra);

	try {
		await toast.promise(service.register(username, password), {
			success: "User created",
			pending: "Registering user",
		});

		// Auto login if the user is not logged (first user)
		if (!user) {
			dispatch(login());
		}
	} catch (e) {
		const err = e as AxiosError;
		const texts = {
			[HttpStatusCode.CONFLICT.toString()]: `"${username}" is already taken`,
		};
		const text = texts[err.status!.toString()] ?? "An error occurred during register";

		toast.error(text);
	}
});

export const checkIfUserExist = createAsyncThunk("check-if-user-exist", async (_, { extra }) => {
	const service = getService(UsersService, extra);
	return service.checkIfUsersExist();
});

export const login = createAsyncThunk("login", async (_, { extra, getState, dispatch }) => {
	const {
		authentication: { username, password },
	} = getState() as StoreState;

	const authService = getService(AuthenticationService, extra);
	const tokenService = getService(TokenService, extra);

	try {
		const jwt = await toast.promise(authService.login(username, password), {
			success: "Logged",
			pending: "Logging in",
		});

		tokenService.setToken(jwt);

		const user = tokenService.parseJwt(jwt);

		dispatch(setUserFromToken(user));
		dispatch(goBack());
	} catch (e) {
		const err = e as AxiosError;
		const texts = {
			[HttpStatusCode.LOCKED.toString()]: `"${username}" is disabled`,
			[HttpStatusCode.FORBIDDEN.toString()]: "Wrong username or password",
		};

		const text = texts[err.status!.toString()] ?? "An error occurred during login";

		toast.error(text);
	}
});

export const logout = createAsyncThunk("logout", async (_, { extra, dispatch }) => {
	const localStorageService = getService<LocalStorageService>(DiKeysService.localStorage.jwt, extra);
	localStorageService.remove();
	toast.success("Logged out");
	dispatch(changeLocation("login"));
});

export const refreshToken = createAsyncThunk("refresh-token", async (_, { extra }) => {
	const localStorageService = getService<LocalStorageService>(DiKeysService.localStorage.jwt, extra);
	const authenticationService = getService(AuthenticationService, extra);
	const token = await authenticationService.refreshJwt();
	localStorageService.set(token);
});

export const silentLogin = createAsyncThunk("silent-login", async (_, { extra, dispatch }) => {
	const tokenService = getService(TokenService, extra);
	const authenticationService = getService(AuthenticationService, extra);

	const jwt = tokenService.getToken();

	if (jwt && (await authenticationService.isValid())) {
		const user = tokenService.parseJwt(jwt);
		dispatch(setUserFromToken(user));
	} else {
		tokenService.delete();
	}
});

export const changePassword = createAsyncThunk("change-password", async (_, { extra, getState }) => {
	const {
		authentication: { username, password },
	} = getState() as StoreState;

	const service = getService(AuthenticationService, extra);

	await toast.promise(service.changePassword(username, password), {
		success: "Password changed",
		error: "An error occurred during changing your password",
	});
});
