import { adaptV4Theme, createTheme, Theme } from "@mui/material";
import * as colors from "@mui/material/colors";
import { Services } from "../core/services";
import { UserSettingsModel } from "../core/apis/backend";

const darkTheme = createTheme(adaptV4Theme({
	palette: {
		mode: "dark",
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
}));

const lightTheme = createTheme(adaptV4Theme({
	palette: {
		mode: "light",
		secondary: {
			...colors.grey,
			main: colors.grey["900"],
		},
		primary: {
			...colors.blue,
			main: colors.blue["400"],
		},
	},
}));

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
