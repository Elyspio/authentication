import { ExtraArgument } from "../index";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { checkIfUserExist, silentLogin } from "../module/authentication/authentication.async.action";

type Constructor<T> = new (...args: any[]) => T;

export function getService<T>(service: Constructor<T> | string | symbol, extra): T {
	const { container } = extra as ExtraArgument;
	return container.get(service);
}

export function createActionBase(base: string) {
	return <T = void>(suffix: string) => createAction<T>(`${base}/${suffix}`);
}

export const initApp = createAsyncThunk("initApp", async (_, { dispatch, extra }) => {
	dispatch(checkIfUserExist());
	dispatch(silentLogin());
});
