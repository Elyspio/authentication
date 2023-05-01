import { createReducer } from "@reduxjs/toolkit";
import { setAuthenticationField, setUserFromToken } from "./authentication.action";
import { User } from "@apis/backend/generated";
import { checkIfUserExist, logout } from "./authentication.async.action";

export interface AuthenticationState {
	username: string;
	password: string;
	user?: User;
	init: boolean;
}

const defaultState = (): AuthenticationState => ({
	init: false,
	password: "",
	username: "",
});

export const authenticationReducer = createReducer(defaultState, (builder) => {
	builder.addCase(setAuthenticationField, (state, action) => {
		state[action.payload.field] = action.payload.value;
	});

	builder.addCase(setUserFromToken, (state, action) => {
		state.user = action.payload;
	});

	builder.addCase(logout.fulfilled, (state) => {
		state.user = undefined;
	});

	builder.addCase(checkIfUserExist.fulfilled, (state, action) => {
		state.init = !action.payload;
	});
});
