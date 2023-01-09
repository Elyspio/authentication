import { injectable } from "inversify";

@injectable()
export class BaseService {
	constructor() {
		if (window.config.log) this.logMethods();
	}

	private logMethods() {
		let methods = this.getChildMethods();
		for (const method of methods) {
			this[method] = new Proxy(this[method], {
				apply(target: any, thisArg: any, argArray: any[]): any {
					const name = Object.getPrototypeOf(thisArg).constructor.name;

					console.debug(`${name}.${target.name}()`, ...argArray);

					return target.apply(thisArg, argArray);
				},
			});
		}
	}

	private getChildMethods() {
		return Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter((f) => f !== "constructor");
	}
}
