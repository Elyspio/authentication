import { createAsyncThunk } from "@reduxjs/toolkit";
import { StoreState } from "../../index";
import { getService } from "../../common/common.actions";
import { AuthenticationService } from "../../../core/services/authentication.service";

type RegisterParam = {
	username: string;
	password: string;
};
export const register = createAsyncThunk("authentication/register", async (_, { extra, getState, dispatch }) => {
	const {
		authentication: { username, password },
	} = getState() as StoreState;

	const service = getService(AuthenticationService, extra);

	await service.register(username, password);

	dispatch(login());
});

export const login = createAsyncThunk("authentication/register", async (_, { extra, getState }) => {
	const {
		authentication: { username, password },
	} = getState() as StoreState;

	const service = getService(AuthenticationService, extra);

	return await service.login(username, password);
});
