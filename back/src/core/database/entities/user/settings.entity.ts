import { Column } from "typeorm";

export enum UserTheme {
	Light = "light",
	System = "system",
	Dark = "dark",
}

export class SettingsEntity {
	@Column({ type: "enum", enum: UserTheme, default: UserTheme.System })
	theme!: UserTheme;
}
