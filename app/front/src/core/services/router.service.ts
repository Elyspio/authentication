import { History } from "history";
import { AnyAction as ReduxAction } from "redux";
import { push } from "redux-first-history";

export const changeLocation = (...args: Parameters<History["push"]>): ReduxAction => {
	return push(`/authentication/${args[0]}`, args[1]);
};
