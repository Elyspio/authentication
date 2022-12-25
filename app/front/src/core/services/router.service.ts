import { History } from "history";
import { AnyAction as ReduxAction } from "redux";
import { push } from "redux-first-history";
import { applicationPaths } from "../../config/routes";

export const changeLocation = (to: keyof typeof applicationPaths, ...args: Parameters<OmitFirstArg<History["push"]>>): ReduxAction => {
	return push(`/authentication/${applicationPaths[to]}`, ...args);
};

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;
