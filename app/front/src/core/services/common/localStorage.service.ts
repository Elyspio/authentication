import { injectable } from "inversify";
import { BaseService } from "../technical/base.service";

@injectable()
export class LocalStorageService extends BaseService {
	constructor(private base: string) {
		super();
	}

	set(value: number | string | object, key?: string) {
		let name = this.base;
		if (key !== undefined) name += " " + key;
		window.localStorage.setItem(name, JSON.stringify(value));
	}

	get<T>(key?: string): T | undefined {
		let name = this.base;
		if (key !== undefined) name += " " + key;
		const baseObj = window.localStorage.getItem(name);
		if (baseObj === null) return undefined;
		return JSON.parse(baseObj) as T;
	}

	remove(key?: string) {
		let name = this.base;
		if (key !== undefined) name += " " + key;
		window.localStorage.removeItem(name);
	}
}
