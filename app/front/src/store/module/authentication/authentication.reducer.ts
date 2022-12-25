import { createReducer } from "@reduxjs/toolkit";
import { setAuthenticationField } from "./authentication.action";

export interface AuthenticationState {
	logged: boolean;
	username: string;
	password: string;
}

const defaultState: AuthenticationState = {
	logged: false,
	password: "",
	username: "",
};

export const authenticationReducer = createReducer(defaultState, (builder) => {
	builder.addCase(setAuthenticationField, (state, action) => {
		state[action.payload.field] = action.payload.value;
	});
});
