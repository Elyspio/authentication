/**
 * list of md5 hashed passwords
 */

export type Accounts = {
	[key in string]: Account
}

export interface Account {
	hash: string;
	credentials: Credentials;
	settings: UserSettings
}

export interface Credentials {
	github?: Github;
	docker?: Docker;
}

export interface UserSettings {
	theme: "dark" | "light" | "system"
}

export interface Docker {
	username: string;
	password: string;
}

export interface Github {
	token: string;
	user: string;
}
