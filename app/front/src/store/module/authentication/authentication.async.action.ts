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

export const register = createAsyncThunk("authentication/register", async (_, { extra, getState, dispatch }) => {
	const {
		authentication: { username, password },
	} = getState() as StoreState;

	const service = getService(AuthenticationService, extra);

	await toast.promise(service.register(username, password), {
		success: "User created",
		error: "Could not register user",
		pending: "Registering user",
	});

	dispatch(login());
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

	const jwt = await toast.promise(authService.login(username, password), {
		success: "Logged",
		pending: "Logging in",
		error: "Could not login",
	});

	tokenService.setToken(jwt);

	const user = tokenService.parseJwt(jwt);
	dispatch(setUserFromToken(user));

	dispatch(changeLocation("dashboard"));
});

export const logout = createAsyncThunk("authentication/logout", async (_, { extra, dispatch }) => {
	const localStorageService = getService<LocalStorageService>(DiKeysService.localStorage.jwt, extra);
	localStorageService.remove();
	toast.success("Logged out");
	dispatch(changeLocation("login"));
});

export const silentLogin = createAsyncThunk("authentication/silentLogin", async (_, { extra, dispatch }) => {
	const tokenService = getService(TokenService, extra);
	const authenticationService = getService(AuthenticationService, extra);

	const jwt = tokenService.getToken();

	if (jwt && (await authenticationService.isValid())) {
		const user = tokenService.parseJwt(jwt);
		dispatch(setUserFromToken(user));
		dispatch(changeLocation("dashboard"));
	} else {
		tokenService.delete();
	}
});
