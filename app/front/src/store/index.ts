import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { themeReducer } from "@modules/theme/theme.reducer";
import { authenticationReducer } from "@modules/authentication/authentication.reducer";
import { container } from "@/core/di";
import { createBrowserHistory } from "history";
import { createReduxHistoryContext } from "redux-first-history";
import { usersReducer } from "@modules/users/users.reducer";

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({ history: createBrowserHistory() });

const store = configureStore({
	reducer: {
		theme: themeReducer,
		authentication: authenticationReducer,
		router: routerReducer,
		users: usersReducer,
	},
	devTools: process.env.NODE_ENV !== "production",
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: { extraArgument: { container } as ExtraArgument } }).prepend(routerMiddleware),
});

export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type ExtraArgument = { container: typeof container };

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export const history = createReduxHistory(store);

export default store;
