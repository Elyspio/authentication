import { createReducer } from "@reduxjs/toolkit";
import { setAuthenticationField } from "./authentication.action";
import { User } from "../../../core/apis/backend/generated";
import { checkIfUserExist, login } from "./authentication.async.action";

export interface AuthenticationState {
	username: string;
	password: string;
	user?: User;
	init: boolean;
}

const defaultState: AuthenticationState = {
	init: false,
	password: "",
	username: "",
};

export const authenticationReducer = createReducer(defaultState, (builder) => {
	builder.addCase(setAuthenticationField, (state, action) => {
		state[action.payload.field] = action.payload.value;
	});

	builder.addCase(login.fulfilled, (state, action) => {
		state.user = action.payload;
	});

	builder.addCase(checkIfUserExist.fulfilled, (state, action) => {
		state.init = action.payload;
	})

});
