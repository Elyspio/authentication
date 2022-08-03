import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authenticationReducer } from "./module/authentication/authentication.reducer";
import { themeReducer } from "./module/theme/theme.reducer";
import { createBrowserHistory } from "history";
import { createReduxHistoryContext } from "redux-first-history";

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({ history: createBrowserHistory() });

const store = configureStore({
	reducer: {
		router: routerReducer,
		theme: themeReducer,
		authentication: authenticationReducer,
	},
	devTools: process.env.NODE_ENV !== "production",
	middleware: (getDefaultMiddleware) => {
		const arr = getDefaultMiddleware();

		arr.push(routerMiddleware);
		return arr;
	},
});
export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export default store;

export const history = createReduxHistory(store);
