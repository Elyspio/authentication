import { createAction as _createAction } from "@reduxjs/toolkit";
import store from "../../index";
import { UserSettingsModelThemeEnum } from "../../../core/apis/backend";

const createAction = <T>(name: string) => _createAction<T>(`theme/${name}`);

export const setTheme = createAction<"dark" | "light">("set");
export const toggleTheme = createAction<void>("toggle");

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
	const newColorScheme = e.matches ? "dark" : "light";
	const { settings } = store.getState().authentication;
	if (settings?.theme === UserSettingsModelThemeEnum.System) {
		store.dispatch(setTheme(newColorScheme));
	}
});
