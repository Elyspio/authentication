import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {authenticationReducer} from "./module/authentication/authentication.reducer";
import {settingsReducer} from "./module/settings/settings.reducer";
import {themeReducer} from "./module/theme/theme.reducer";

const store = configureStore({
	reducer: {
		theme: themeReducer,
		authentication: authenticationReducer,
		settings: settingsReducer
	},
	devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store;

