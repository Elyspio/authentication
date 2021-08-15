import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {authenticationReducer} from "./module/authentication/authentication.reducer";
import {themeReducer} from "./module/theme/theme.reducer";
import {connectRouter, routerMiddleware} from 'connected-react-router'
import {createBrowserHistory} from 'history'

export const history = createBrowserHistory({
	basename: "/authentication"
})


const createRootReducer = (history) => combineReducers({
	router: connectRouter(history),
	theme: themeReducer,
	authentication: authenticationReducer,
	// rest of your reducers
})

const store = configureStore({
	reducer: createRootReducer(history),
	devTools: process.env.NODE_ENV !== "production",
	middleware: getDefaultMiddleware => [
		routerMiddleware(history),
		...getDefaultMiddleware(),
	],

});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store;

