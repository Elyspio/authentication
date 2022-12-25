import { createAsyncThunk } from "@reduxjs/toolkit";
import { StoreState } from "../../index";
import { getService } from "../../common/common.actions";
import { UsersService } from "../../../core/services/users.service";
import { LocalStorageService } from "../../../core/services/common/localStorage.service";
import { DiKeysService } from "../../../core/di/services/di.keys.service";
import { AuthenticationService } from "../../../core/services/authentication.service";

export const register = createAsyncThunk("authentication/register", async (_, { extra, getState, dispatch }) => {
	const {
		authentication: { username, password },
	} = getState() as StoreState;

	const service = getService(AuthenticationService, extra);

	await service.register(username, password);

	dispatch(login());
});

export const checkIfUserExist = createAsyncThunk("authentication/register", async (_, { extra }) => {
	const service = getService(UsersService, extra);
	return service.checkIfUsersExist();
});

export const login = createAsyncThunk("authentication/login", async (_, { extra, getState }) => {
	const {
		authentication: { username, password },
	} = getState() as StoreState;

	const authService = getService(AuthenticationService, extra);
	const localStorageService = getService<LocalStorageService>(DiKeysService.localStorage.jwt, extra);

	const { jwt, data } = await authService.login(username, password);

	localStorageService.set(jwt);

	return data;
});

export const logout = createAsyncThunk("authentication/login", async (_, { extra }) => {
	const localStorageService = getService<LocalStorageService>(DiKeysService.localStorage.jwt, extra);
	localStorageService.remove();
});
