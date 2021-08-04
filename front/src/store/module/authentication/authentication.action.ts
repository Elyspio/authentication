import {createAsyncThunk} from "@reduxjs/toolkit";
import {Services} from "../../../core/services";

export const login = createAsyncThunk("authentication/login", async (payload: { name: string, password: string }) => {
	const {token} = await Services.authentication.login(payload);
	const username = await Services.authentication.getUsername();
	const [settings, credentials] = await Promise.all([
		Services.authentication.getSettings(username),
		Services.authentication.getCredentials(username)
	])
	return {
		token,
		username,
		settings,
		credentials
	}
})

export const logout = createAsyncThunk("authentication/logout", async () => {
	await Services.authentication.logout();
})

