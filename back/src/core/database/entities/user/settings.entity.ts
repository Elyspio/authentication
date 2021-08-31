import {Column} from "typeorm";


export enum Theme {
	Light = "light",
	System = "system",
	Dark = "dark"
}

export class SettingsEntity {
	@Column({type: "enum", enum: Theme, default: Theme.System,})
	theme: Theme;
}
