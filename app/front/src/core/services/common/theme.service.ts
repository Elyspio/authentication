import { Themes } from "../../../config/theme";
import { injectable } from "inversify";
import { BaseService } from "../technical/base.service";

@injectable()
export class ThemeService extends BaseService {
	getThemeFromSystem(): Themes {
		return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
}
