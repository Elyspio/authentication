import { createTheme, Theme } from "@material-ui/core";
import * as colors from "@material-ui/core/colors";
import { Services } from "../core/services";
import { UserSettingsModel } from "../core/apis/backend";

const darkTheme = createTheme({
	palette: {
		type: "dark",
		secondary: {
			...colors.grey,
			main: colors.grey["500"],
		},
		primary: {
			...colors.blue,
			main: colors.blue["400"],
		},
		background: {
			paper: "#1d1d1d",
			default: "#181818",
		},
	},
});

const lightTheme = createTheme({
	palette: {
		type: "light",
		secondary: {
			...colors.grey,
			main: colors.grey["900"],
		},
		primary: {
			...colors.blue,
			main: colors.blue["400"],
		},
	},
});

export const themes = {
	dark: darkTheme,
	light: lightTheme,
};

export type Themes = "dark" | "light";

export const getUrlTheme = (): Themes => {
	let fromUrl = new URL(window.location.toString()).searchParams.get("theme");
	let fromSession = Services.localStorage.settings.retrieve<UserSettingsModel>();
	if (fromUrl) return fromUrl as Themes;
	if (fromSession?.theme) {
		if (fromSession.theme === "system") {
			return Services.theme.getThemeFromSystem();
		} else return fromSession.theme;
	}
	return Services.theme.getThemeFromSystem();
};

export const getCurrentTheme = (theme: Themes): Theme => {
	return themes[theme];
};
