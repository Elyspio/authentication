import { createAsyncThunk, Dispatch } from "@reduxjs/toolkit";
import { Services } from "../../../core/services";
import { AuthorizationModel, CredentialsModel, SetUserSettingsModel, UserSettingsModel, UserSettingsModelThemeEnum } from "../../../core/apis/backend";
import { setTheme } from "../theme/theme.action";
import { Themes } from "../../../config/theme";
import { toast } from "react-toastify";

export const getUserMetadata = createAsyncThunk("authentication/getUserMetadata", async (_, { dispatch }) => {
	const token = await Services.authentication.getToken();
	const username = await Services.user.username.get();
	const [settings, credentials, authorizations] = await Promise.all([
		Services.user.settings.get(username),
		Services.user.credentials.get(username),
		Services.user.authorizations.get(username),
	]);

	Services.localStorage.settings.store(undefined, settings);

	await updateTheme(dispatch, settings.theme);

	return {
		token,
		username,
		settings,
		credentials,
		authorizations,
	};
});

export const login = createAsyncThunk("authentication/login", async (payload: { name: string; password: string }, { dispatch }) => {
	const { token } = await Services.authentication.login(payload);
	if (token) {
		Services.localStorage.validation.store(undefined, "done");
		await dispatch(getUserMetadata()).then(() => {
			toast.success("Logged in");
		});
	}
});

export const create = createAsyncThunk("authentication/create", async (payload: { name: string; password: string }, { dispatch }) => {
	await Services.authentication.create(payload);
	dispatch(login(payload));
});

export const verifyLogin = createAsyncThunk("authentication/verifyLogin", async (_, { dispatch }) => {
	const valid = await Services.authentication.isValid();
	if (valid) {
		Services.localStorage.validation.store(undefined, "done");
		await dispatch(getUserMetadata());
	}
});

export const logout = createAsyncThunk("authentication/logout", async () => {
	await Services.authentication.logout();
});

export const setUserSettings = createAsyncThunk("authentication/setUserSettings", async (arg: { username: string; settings: SetUserSettingsModel }, { dispatch }) => {
	try {
		await Services.user.settings.set(arg.username, arg.settings);
		await dispatch(getUserMetadata());
		toast.success("Successfully set User settings");
	} catch {
		toast.success("Successfully set User settings");
	}
});

export const setUserCredentials = createAsyncThunk("authentication/setUserCredentials", async (arg: { username: string; credential: CredentialsModel }, { dispatch }) => {
	try {
		await Services.user.credentials.set(arg.username, arg.credential);
		await dispatch(getUserMetadata());
		toast.success("Successfully set User credentials");
	} catch {
		toast.error("Could not set User credentials");
	}
});

export const setUserAuthorizations = createAsyncThunk(
	"authentication/setUserAuthorizations",
	async (arg: { username: string; authorizations: AuthorizationModel }, { dispatch }) => {
		try {
			await Services.user.authorizations.set(arg.username, arg.authorizations);
			await dispatch(getUserMetadata());
			toast.success("Successfully set User authorizations");
		} catch {
			toast.error("Could not set User authorizations");
		}
	}
);

export const checkIfSomeUserExist = createAsyncThunk("authentication/checkIfSomeUserExist", async () => {
	return {
		exist: await Services.user.checkIfSomeUserExist(),
	};
});

function updateTheme(dispatch: Dispatch, theme: UserSettingsModel["theme"]) {
	let themeStr: Themes;
	if (theme === UserSettingsModelThemeEnum.System) themeStr = Services.theme.getThemeFromSystem();
	else themeStr = theme.toString() as Themes;
	dispatch(setTheme(themeStr));
}
