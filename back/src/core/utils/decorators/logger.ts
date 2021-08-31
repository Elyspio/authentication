import {Logger} from "@tsed/logger";
import {Helper} from "../helper";
import * as util from "util";


declare global {
	interface Function {
		logger: Logger
	}
}


/**
 *
 * @param logger
 * @param logArguments false means that no argument is logged, [] means that all arguments are logged, [0] means that only the first argument is logged
 * @param level
 * @constructor
 */
export const Log = (logger: Logger, logArguments: number[] | boolean = true, level: "debug" | "info" = "info") => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
	let originalMethod = descriptor.value


	const argsName = Helper.getFunctionArgs(originalMethod);

	descriptor.value = function (...args: any[]) {
		let argsStr = ""

		if (logArguments !== false) {
			argsStr = argsName.reduce((previousValue, currentValue, currentIndex) => {
				if (logArguments !== true) {
					if (!logArguments.includes(currentIndex)) return previousValue;
				}
				return `${previousValue} ${currentValue}=${util.inspect(args[currentIndex])}`
			}, "-");
		}

		logger[level](`${propertyKey} - Entering ${argsStr}`);

		const now = Date.now();
		const result = originalMethod.apply(this, args);

		const exitLog = () => {
			logger[level](`${propertyKey} - Exited after ${Date.now() - now}ms`);
		};

		if (typeof result === "object" && typeof result.then === "function") {
			const promise = result.then((ret) => {
				exitLog();
				return ret;
			});
			if (typeof promise.catch === "function") {
				promise.catch((e: Error) => {
					logger.error(`${propertyKey} - Error ${e}`, {stack: e.stack})
					return e
				});
			}
		} else {
			exitLog();
		}

		return result;
	};

}

Log.service = (logger: Logger, logArguments: number[] | boolean = true,) => Log(logger, logArguments, "debug")


