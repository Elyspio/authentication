import {createAsyncThunk, Dispatch} from "@reduxjs/toolkit";
import {Services} from "../../../core/services";
import {SetUserSettingsModel, UserSettingsModel, UserSettingsModelThemeEnum} from "../../../core/apis/backend";
import {setTheme} from "../theme/theme.action";
import {Themes} from "../../../config/theme";


export const getUserMetadata = createAsyncThunk("authentication/getUserMetadata", async (_, {dispatch}) => {
	const token = await Services.authentication.getToken();
	const username = await Services.user.username.get();
	const [settings, credentials] = await Promise.all([
		Services.user.settings.get(username),
		Services.user.credentials.get(username)
	])

	Services.localStorage.settings.store(undefined, settings);

	await updateTheme(dispatch, settings.theme);

	return {
		token,
		username,
		settings,
		credentials
	}
});


export const login = createAsyncThunk("authentication/login", async (payload: { name: string, password: string }, {dispatch}) => {
	const {token} = await Services.authentication.login(payload);
	if (token) {
		await dispatch(getUserMetadata());
	}
})


export const verifyLogin = createAsyncThunk("authentication/verifyLogin", async (_, {dispatch}) => {
	const valid = await Services.authentication.isValid();
	if (valid) await dispatch(getUserMetadata());
})


export const logout = createAsyncThunk("authentication/logout", async () => {
	await Services.authentication.logout();
})




export const setUserSettings = createAsyncThunk("authentication/setUserSettings", async (arg: { username: string, settings: SetUserSettingsModel }, {dispatch}) => {
	await Services.user.settings.set(arg.username, arg.settings)
	await dispatch(getUserMetadata());
})



function updateTheme(dispatch: Dispatch, theme: UserSettingsModel["theme"]) {
	let themeStr: Themes;
	if (theme === UserSettingsModelThemeEnum.System) themeStr = Services.theme.getThemeFromSystem();
	else themeStr = theme.toString() as Themes
	dispatch(setTheme(themeStr));
}

