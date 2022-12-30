import { createAsyncThunk } from "@reduxjs/toolkit";
import { StoreState } from "../../index";
import { getService } from "../../common/common.actions";
import { UsersService } from "../../../core/services/users.service";
import { LocalStorageService } from "../../../core/services/common/localStorage.service";
import { DiKeysService } from "../../../core/di/services/di.keys.service";
import { AuthenticationService } from "../../../core/services/authentication.service";
import { toast } from "react-toastify";
import { TokenService } from "../../../core/services/token.service";
import { setUserFromToken } from "./authentication.action";
import { changeLocation } from "../../../core/services/router.service";
import { AxiosError } from "axios";
import * as HttpStatusCode from "http-status";
import { goBack } from "redux-first-history";

export const register = createAsyncThunk("authentication/register", async (_, { extra, getState, dispatch }) => {
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
			[HttpStatusCode.CONFLICT]: `"${username}" is already taken`,
		};
		const text = texts[err.status!.toString()] ?? "An error occurred during register";

		toast.error(text);
	}
});

export const checkIfUserExist = createAsyncThunk("authentication/checkIfUserExist", async (_, { extra }) => {
	const service = getService(UsersService, extra);
	return service.checkIfUsersExist();
});

export const login = createAsyncThunk("authentication/login", async (_, { extra, getState, dispatch }) => {
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
			[HttpStatusCode.LOCKED]: `"${username}" is disabled`,
			[HttpStatusCode.FORBIDDEN]: "Wrong username or password",
		};

		const text = texts[err.status!.toString()] ?? "An error occurred during login";

		toast.error(text);
	}
});

export const logout = createAsyncThunk("authentication/logout", async (_, { extra, dispatch }) => {
	const localStorageService = getService<LocalStorageService>(DiKeysService.localStorage.jwt, extra);
	localStorageService.remove();
	toast.success("Logged out");
	dispatch(changeLocation("login"));
});

export const refreshToken = createAsyncThunk("authentication/refreshToken", async (_, { extra, dispatch }) => {
	const localStorageService = getService<LocalStorageService>(DiKeysService.localStorage.jwt, extra);
	const authenticationService = getService(AuthenticationService, extra);
	const token = await authenticationService.refreshJwt();
	localStorageService.set(token);
});

export const silentLogin = createAsyncThunk("authentication/silentLogin", async (_, { extra, dispatch }) => {
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

export const changePassword = createAsyncThunk("authentication/changePassword", async (_, { extra, getState, dispatch }) => {
	const {
		authentication: { username, password },
	} = getState() as StoreState;

	const service = getService(AuthenticationService, extra);

	await toast.promise(service.changePassword(username, password), {
		success: "Password changed",
		error: "An error occurred during changing your password",
	});
});
