import { Themes } from "../../config/theme";

export class ThemeService {
	getThemeFromSystem(): Themes {
		return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
}
